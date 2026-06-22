package com.restaurantmanagement.modules.orders.service;
import com.restaurantmanagement.modules.branches.entity.Branch;
import com.restaurantmanagement.modules.branches.repository.BranchRepository;
import com.restaurantmanagement.modules.inventory.entity.MenuItemIngredient;
import com.restaurantmanagement.modules.inventory.entity.MovementType;
import com.restaurantmanagement.modules.inventory.entity.StockMovement;
import com.restaurantmanagement.modules.inventory.repository.InventoryItemRepository;
import com.restaurantmanagement.modules.inventory.repository.MenuItemIngredientRepository;
import com.restaurantmanagement.modules.inventory.repository.StockMovementRepository;
import com.restaurantmanagement.modules.kitchen.service.KitchenBroadcastService;
import com.restaurantmanagement.modules.loyalty.entity.Coupon;
import com.restaurantmanagement.modules.loyalty.entity.LoyaltyPoints;
import com.restaurantmanagement.modules.loyalty.repository.CouponRepository;
import com.restaurantmanagement.modules.loyalty.repository.LoyaltyPointsRepository;
import com.restaurantmanagement.modules.menu.entity.MenuItem;
import com.restaurantmanagement.modules.menu.repository.MenuItemRepository;
import com.restaurantmanagement.modules.orders.dto.*;
import com.restaurantmanagement.modules.orders.entity.*;
import com.restaurantmanagement.modules.orders.mapper.OrderMapper;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.modules.orders.repository.PaymentRepository;
import com.restaurantmanagement.modules.tables.entity.RestaurantTable;
import com.restaurantmanagement.modules.tables.entity.TableStatus;
import com.restaurantmanagement.modules.tables.repository.RestaurantTableRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service @RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final BranchRepository branchRepository;
    private final MenuItemRepository menuItemRepository;
    private final CouponRepository couponRepository;
    private final KitchenBroadcastService kitchenBroadcastService;
    private final RestaurantTableRepository tableRepository;
    private final MenuItemIngredientRepository menuItemIngredientRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockMovementRepository stockMovementRepository;
    private final LoyaltyPointsRepository loyaltyPointsRepository;
    private final AppMessages appMessages;

    public List<OrderResponse> list(Long branchId) {
        return (branchId != null ? orderRepository.findByBranchIdOrderByCreatedAtDesc(branchId) : orderRepository.findAll())
                .stream().map(OrderMapper::toResponse).toList();
    }
    public OrderResponse getById(Long id) { return OrderMapper.toResponse(find(id)); }

    @Transactional
    public OrderResponse create(OrderRequest req) {
        Long branchId = req.getBranchId() != null ? req.getBranchId() : 1L;
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> AppException.notFound(appMessages.get("branch.not_found")));
        OrderEntity order = OrderEntity.builder().orderNumber("ORD-" + System.currentTimeMillis())
                .branchId(branchId).tableId(req.getTableId()).customerId(req.getCustomerId())
                .waiterId(req.getWaiterId()).orderType(req.getOrderType()).status(OrderStatus.PENDING)
                .notes(req.getNotes()).items(new ArrayList<>()).build();
        BigDecimal subtotal = BigDecimal.ZERO;
        if (req.getItems() != null) {
            for (OrderItemRequest ir : req.getItems()) {
                OrderItem item = buildItem(order, ir);
                subtotal = subtotal.add(item.getLineTotal());
                order.getItems().add(item);
            }
        }
        applyTotals(order, branch, subtotal, BigDecimal.ZERO);
        OrderEntity saved = orderRepository.save(order);
        if (req.getTableId() != null) {
            occupyTable(req.getTableId());
        }
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatusRequest req) {
        OrderEntity order = find(id);
        order.setStatus(req.getStatus());
        LocalDateTime now = LocalDateTime.now();
        switch (req.getStatus()) {
            case ACCEPTED -> order.setAcceptedAt(now);
            case PREPARING -> order.setPreparingAt(now);
            case READY -> order.setReadyAt(now);
            case COMPLETED, DELIVERED -> order.setCompletedAt(now);
            default -> {}
        }
        if (req.getStatus() == OrderStatus.COMPLETED || req.getStatus() == OrderStatus.CANCELLED) {
            freeTable(order.getTableId());
        }
        OrderEntity saved = orderRepository.save(order);
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse hold(Long id, boolean held) {
        OrderEntity order = find(id);
        ensureNotCompleted(order);
        order.setHeld(held);
        OrderEntity saved = orderRepository.save(order);
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse split(Long id, List<Long> itemIds) {
        OrderEntity source = find(id);
        ensureNotCompleted(source);
        OrderEntity target = OrderEntity.builder().orderNumber("ORD-" + System.currentTimeMillis())
                .branchId(source.getBranchId()).tableId(source.getTableId()).customerId(source.getCustomerId())
                .waiterId(source.getWaiterId()).orderType(source.getOrderType()).status(source.getStatus())
                .notes("Split from " + source.getOrderNumber()).items(new ArrayList<>()).build();
        BigDecimal moved = BigDecimal.ZERO;
        List<OrderItem> toMove = source.getItems().stream().filter(i -> itemIds.contains(i.getId())).toList();
        for (OrderItem item : toMove) {
            source.getItems().remove(item);
            item.setOrder(target);
            target.getItems().add(item);
            moved = moved.add(item.getLineTotal());
        }
        Branch branch = branchRepository.findById(source.getBranchId()).orElseThrow();
        recalc(source, branch);
        recalc(target, branch);
        orderRepository.save(source);
        orderRepository.save(target);
        kitchenBroadcastService.broadcastOrderUpdate(source.getBranchId());
        return OrderMapper.toResponse(target);
    }

    @Transactional
    public OrderResponse merge(MergeOrdersRequest req) {
        List<OrderEntity> orders = orderRepository.findAllById(req.getOrderIds());
        if (orders.size() < 2) throw AppException.badRequest("At least two orders required to merge");
        for (OrderEntity o : orders) ensureNotCompleted(o);
        OrderEntity primary = orders.get(0);
        for (int i = 1; i < orders.size(); i++) {
            OrderEntity other = orders.get(i);
            for (OrderItem item : new ArrayList<>(other.getItems())) {
                other.getItems().remove(item);
                item.setOrder(primary);
                primary.getItems().add(item);
            }
            other.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(other);
        }
        Branch branch = branchRepository.findById(primary.getBranchId()).orElseThrow();
        recalc(primary, branch);
        OrderEntity saved = orderRepository.save(primary);
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse checkout(Long id, CheckoutRequest req) {
        OrderEntity order = find(id);
        if (req.getTipAmount() != null) order.setTipAmount(req.getTipAmount());
        BigDecimal discount = order.getDiscountAmount();
        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCodeIgnoreCase(req.getCouponCode())
                    .orElseThrow(() -> AppException.badRequest(appMessages.get("coupon.invalid")));
            discount = applyCoupon(order, coupon);
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }
        order.setDiscountAmount(discount);
        order.setTotalAmount(order.getSubtotal().subtract(discount).add(order.getTaxAmount())
                .add(order.getServiceCharge()).add(order.getTipAmount()));
        if (req.getAmount().compareTo(order.getTotalAmount()) < 0) {
            throw AppException.badRequest("Payment amount is less than order total");
        }
        Payment payment = Payment.builder().orderId(order.getId()).paymentMethod(req.getPaymentMethod())
                .amount(req.getAmount()).reference(req.getReference()).build();
        paymentRepository.save(payment);
        deductInventory(order);
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        freeTable(order.getTableId());
        if (order.getCustomerId() != null) {
            addLoyaltyPoints(order);
        }
        OrderEntity saved = orderRepository.save(order);
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
    }

    private void deductInventory(OrderEntity order) {
        String reference = order.getOrderNumber();
        for (OrderItem item : order.getItems()) {
            if (item.getMenuItemId() == null) continue;
            List<MenuItemIngredient> ingredients = menuItemIngredientRepository.findByMenuItemId(item.getMenuItemId());
            for (MenuItemIngredient ing : ingredients) {
                BigDecimal qty = ing.getQuantityUsed().multiply(BigDecimal.valueOf(item.getQuantity()));
                inventoryItemRepository.findById(ing.getInventoryItemId()).ifPresent(inv -> {
                    inv.setCurrentStock(inv.getCurrentStock().subtract(qty));
                    inventoryItemRepository.save(inv);
                    stockMovementRepository.save(StockMovement.builder()
                            .inventoryItemId(ing.getInventoryItemId())
                            .movementType(MovementType.USAGE)
                            .quantity(qty)
                            .reference(reference)
                            .notes("Order checkout")
                            .build());
                });
            }
        }
    }

    private void addLoyaltyPoints(OrderEntity order) {
        int points = order.getTotalAmount().setScale(0, RoundingMode.FLOOR).intValue();
        if (points <= 0) return;
        LoyaltyPoints lp = loyaltyPointsRepository.findByCustomerId(order.getCustomerId()).orElseGet(() ->
                LoyaltyPoints.builder().customerId(order.getCustomerId()).points(0).lifetimePoints(0).build());
        lp.setPoints(lp.getPoints() + points);
        lp.setLifetimePoints(lp.getLifetimePoints() + points);
        loyaltyPointsRepository.save(lp);
    }

    private void occupyTable(Long tableId) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> AppException.notFound(appMessages.get("table.not_found")));
        table.setStatus(TableStatus.OCCUPIED);
        tableRepository.save(table);
    }

    private void freeTable(Long tableId) {
        if (tableId == null) return;
        tableRepository.findById(tableId).ifPresent(table -> {
            table.setStatus(TableStatus.AVAILABLE);
            tableRepository.save(table);
        });
    }

    private void ensureNotCompleted(OrderEntity order) {
        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.CANCELLED) {
            throw AppException.badRequest("Cannot modify a completed or cancelled order");
        }
    }

    private OrderItem buildItem(OrderEntity order, OrderItemRequest ir) {
        String name = ir.getItemName();
        BigDecimal price = ir.getUnitPrice();
        if (ir.getMenuItemId() != null) {
            MenuItem mi = menuItemRepository.findById(ir.getMenuItemId()).orElseThrow(() -> AppException.notFound(appMessages.get("menu.item.not_found")));
            if (name == null) name = mi.getName();
            if (price == null) price = mi.getPrice();
        }
        int qty = ir.getQuantity() != null ? ir.getQuantity() : 1;
        BigDecimal line = price.multiply(BigDecimal.valueOf(qty));
        return OrderItem.builder().order(order).menuItemId(ir.getMenuItemId()).itemName(name)
                .quantity(qty).unitPrice(price).lineTotal(line).notes(ir.getNotes())
                .modifiersJson(ir.getModifiers() != null ? ir.getModifiers() : new ArrayList<>()).build();
    }

    private void applyTotals(OrderEntity order, Branch branch, BigDecimal subtotal, BigDecimal discount) {
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discount);
        BigDecimal tax = subtotal.multiply(branch.getTaxRate()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal svc = subtotal.multiply(branch.getServiceCharge()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        order.setTaxAmount(tax);
        order.setServiceCharge(svc);
        order.setTotalAmount(subtotal.subtract(discount).add(tax).add(svc).add(order.getTipAmount()));
    }

    private void recalc(OrderEntity order, Branch branch) {
        BigDecimal subtotal = order.getItems().stream().map(OrderItem::getLineTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        applyTotals(order, branch, subtotal, order.getDiscountAmount());
    }

    private BigDecimal applyCoupon(OrderEntity order, Coupon coupon) {
        if (!coupon.isActive()) throw AppException.badRequest(appMessages.get("coupon.invalid"));
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) throw AppException.badRequest(appMessages.get("coupon.invalid"));
        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) throw AppException.badRequest(appMessages.get("coupon.invalid"));
        if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) throw AppException.badRequest(appMessages.get("coupon.invalid"));
        if (order.getSubtotal().compareTo(coupon.getMinOrder()) < 0) throw AppException.badRequest(appMessages.get("coupon.invalid"));
        if (coupon.getDiscountType().name().equals("PERCENT")) {
            return order.getSubtotal().multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        return coupon.getDiscountValue();
    }

    private OrderEntity find(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("order.not_found")));
    }
}
