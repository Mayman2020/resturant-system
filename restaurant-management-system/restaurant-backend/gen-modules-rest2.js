const fs = require('fs');
const path = require('path');
const BASE = path.join('d:', 'Apps Work', 'My Apps', 'resturant system', 'restaurant-management-system', 'restaurant-backend', 'src', 'main', 'java', 'com', 'restaurantmanagement');
function w(rel, content) {
  const full = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n', 'utf8');
  console.log('Wrote', rel);
}

w('modules/orders/dto/OrderItemRequest.java', `package com.restaurantmanagement.modules.orders.dto;
import lombok.Data; import java.math.BigDecimal; import java.util.List; import java.util.Map;
@Data public class OrderItemRequest {
    private Long menuItemId; private String itemName; private Integer quantity;
    private BigDecimal unitPrice; private String notes; private List<Map<String, Object>> modifiers;
}`);

w('modules/orders/dto/OrderRequest.java', `package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.OrderType;
import jakarta.validation.constraints.NotNull; import lombok.Data;
import java.util.List;
@Data public class OrderRequest {
    @NotNull private Long branchId; private Long tableId; private Long customerId; private Long waiterId;
    @NotNull private OrderType orderType; private String notes; private List<OrderItemRequest> items;
}`);

w('modules/orders/dto/OrderResponse.java', `package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import com.restaurantmanagement.modules.orders.entity.OrderType;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime; import java.util.List;
@Data @Builder public class OrderResponse {
    private Long id; private String orderNumber; private Long branchId; private Long tableId;
    private Long customerId; private Long waiterId; private OrderType orderType; private OrderStatus status;
    private BigDecimal subtotal; private BigDecimal discountAmount; private BigDecimal taxAmount;
    private BigDecimal serviceCharge; private BigDecimal tipAmount; private BigDecimal totalAmount;
    private String notes; private boolean held; private LocalDateTime createdAt; private List<OrderItemResponse> items;
}`);

w('modules/orders/dto/OrderItemResponse.java', `package com.restaurantmanagement.modules.orders.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.util.List; import java.util.Map;
@Data @Builder public class OrderItemResponse {
    private Long id; private Long menuItemId; private String itemName; private Integer quantity;
    private BigDecimal unitPrice; private BigDecimal lineTotal; private String notes;
    private List<Map<String, Object>> modifiers;
}`);

w('modules/orders/dto/OrderStatusRequest.java', `package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class OrderStatusRequest { @NotNull private OrderStatus status; }`);

w('modules/orders/dto/CheckoutRequest.java', `package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull; import lombok.Data; import java.math.BigDecimal;
@Data public class CheckoutRequest {
    @NotNull private PaymentMethod paymentMethod; @NotNull private BigDecimal amount;
    private String reference; private BigDecimal tipAmount; private String couponCode;
}`);

w('modules/orders/dto/MergeOrdersRequest.java', `package com.restaurantmanagement.modules.orders.dto;
import jakarta.validation.constraints.NotEmpty; import lombok.Data; import java.util.List;
@Data public class MergeOrdersRequest { @NotEmpty private List<Long> orderIds; }`);

w('modules/orders/mapper/OrderMapper.java', `package com.restaurantmanagement.modules.orders.mapper;
import com.restaurantmanagement.modules.orders.dto.*;
import com.restaurantmanagement.modules.orders.entity.*;
import java.util.List;
public final class OrderMapper {
    private OrderMapper() {}
    public static OrderResponse toResponse(OrderEntity o) {
        return OrderResponse.builder().id(o.getId()).orderNumber(o.getOrderNumber()).branchId(o.getBranchId())
                .tableId(o.getTableId()).customerId(o.getCustomerId()).waiterId(o.getWaiterId())
                .orderType(o.getOrderType()).status(o.getStatus()).subtotal(o.getSubtotal())
                .discountAmount(o.getDiscountAmount()).taxAmount(o.getTaxAmount())
                .serviceCharge(o.getServiceCharge()).tipAmount(o.getTipAmount()).totalAmount(o.getTotalAmount())
                .notes(o.getNotes()).held(o.isHeld()).createdAt(o.getCreatedAt())
                .items(o.getItems() != null ? o.getItems().stream().map(OrderMapper::toItem).toList() : List.of()).build();
    }
    public static OrderItemResponse toItem(OrderItem i) {
        return OrderItemResponse.builder().id(i.getId()).menuItemId(i.getMenuItemId()).itemName(i.getItemName())
                .quantity(i.getQuantity()).unitPrice(i.getUnitPrice()).lineTotal(i.getLineTotal())
                .notes(i.getNotes()).modifiers(i.getModifiersJson()).build();
    }
}`);

w('modules/orders/service/OrderService.java', `package com.restaurantmanagement.modules.orders.service;
import com.restaurantmanagement.modules.branches.entity.Branch;
import com.restaurantmanagement.modules.branches.repository.BranchRepository;
import com.restaurantmanagement.modules.kitchen.service.KitchenBroadcastService;
import com.restaurantmanagement.modules.loyalty.entity.Coupon;
import com.restaurantmanagement.modules.loyalty.repository.CouponRepository;
import com.restaurantmanagement.modules.menu.entity.MenuItem;
import com.restaurantmanagement.modules.menu.repository.MenuItemRepository;
import com.restaurantmanagement.modules.orders.dto.*;
import com.restaurantmanagement.modules.orders.entity.*;
import com.restaurantmanagement.modules.orders.mapper.OrderMapper;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.modules.orders.repository.PaymentRepository;
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
import java.util.UUID;
@Service @RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final BranchRepository branchRepository;
    private final MenuItemRepository menuItemRepository;
    private final CouponRepository couponRepository;
    private final KitchenBroadcastService kitchenBroadcastService;
    private final AppMessages appMessages;

    public List<OrderResponse> list(Long branchId) {
        return (branchId != null ? orderRepository.findByBranchIdOrderByCreatedAtDesc(branchId) : orderRepository.findAll())
                .stream().map(OrderMapper::toResponse).toList();
    }
    public OrderResponse getById(Long id) { return OrderMapper.toResponse(find(id)); }

    @Transactional
    public OrderResponse create(OrderRequest req) {
        Branch branch = branchRepository.findById(req.getBranchId()).orElseThrow(() -> AppException.notFound(appMessages.get("branch.not_found")));
        OrderEntity order = OrderEntity.builder().orderNumber("ORD-" + System.currentTimeMillis())
                .branchId(req.getBranchId()).tableId(req.getTableId()).customerId(req.getCustomerId())
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
        OrderEntity saved = orderRepository.save(order);
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse hold(Long id, boolean held) {
        OrderEntity order = find(id);
        order.setHeld(held);
        OrderEntity saved = orderRepository.save(order);
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse split(Long id, List<Long> itemIds) {
        OrderEntity source = find(id);
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
        Payment payment = Payment.builder().orderId(order.getId()).paymentMethod(req.getPaymentMethod())
                .amount(req.getAmount()).reference(req.getReference()).build();
        paymentRepository.save(payment);
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        OrderEntity saved = orderRepository.save(order);
        kitchenBroadcastService.broadcastOrderUpdate(saved.getBranchId());
        return OrderMapper.toResponse(saved);
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
}`);

w('modules/orders/controller/OrderController.java', `package com.restaurantmanagement.modules.orders.controller;
import com.restaurantmanagement.modules.orders.dto.*;
import com.restaurantmanagement.modules.orders.service.OrderService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/orders") @RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping @RequiresPermission(module = "orders", action = "view")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> list(@RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.list(branchId)));
    }
    @GetMapping("/{id}") @RequiresPermission(module = "orders", action = "view")
    public ResponseEntity<ApiResponse<OrderResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getById(id)));
    }
    @PostMapping @RequiresPermission(module = "orders", action = "create")
    public ResponseEntity<ApiResponse<OrderResponse>> create(@Valid @RequestBody OrderRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(orderService.create(req)));
    }
    @PatchMapping("/{id}/status") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.updateStatus(id, req)));
    }
    @PatchMapping("/{id}/hold") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> hold(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean held) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.hold(id, held)));
    }
    @PostMapping("/{id}/split") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> split(@PathVariable Long id, @RequestBody List<Long> itemIds) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.split(id, itemIds)));
    }
    @PostMapping("/merge") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> merge(@Valid @RequestBody MergeOrdersRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.merge(req)));
    }
    @PostMapping("/{id}/checkout") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(@PathVariable Long id, @Valid @RequestBody CheckoutRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.checkout(id, req)));
    }
}`);

w('modules/kitchen/service/KitchenBroadcastService.java', `package com.restaurantmanagement.modules.kitchen.service;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class KitchenBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;
    public void broadcastOrderUpdate(Long branchId) {
        messagingTemplate.convertAndSend("/topic/kitchen/" + branchId, "refresh");
    }
}`);

w('modules/kitchen/dto/KitchenOrderResponse.java', `package com.restaurantmanagement.modules.kitchen.dto;
import com.restaurantmanagement.modules.orders.dto.OrderResponse;
import lombok.Builder; import lombok.Data; import java.util.List;
@Data @Builder public class KitchenOrderResponse { private Long branchId; private List<OrderResponse> orders; }`);

w('modules/kitchen/service/KitchenService.java', `package com.restaurantmanagement.modules.kitchen.service;
import com.restaurantmanagement.modules.kitchen.dto.KitchenOrderResponse;
import com.restaurantmanagement.modules.orders.dto.OrderResponse;
import com.restaurantmanagement.modules.orders.dto.OrderStatusRequest;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import com.restaurantmanagement.modules.orders.mapper.OrderMapper;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.modules.orders.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor
public class KitchenService {
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final KitchenBroadcastService broadcastService;
    private static final List<OrderStatus> ACTIVE = List.of(OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY);

    public KitchenOrderResponse listActive(Long branchId) {
        List<OrderResponse> orders = orderRepository.findActiveKitchenOrders(branchId, ACTIVE)
                .stream().map(OrderMapper::toResponse).toList();
        return KitchenOrderResponse.builder().branchId(branchId).orders(orders).build();
    }

    @Transactional
    public OrderResponse advanceStatus(Long orderId) {
        var order = orderRepository.findById(orderId).orElseThrow();
        OrderStatus next = switch (order.getStatus()) {
            case PENDING -> OrderStatus.PREPARING;
            case ACCEPTED -> OrderStatus.PREPARING;
            case PREPARING -> OrderStatus.READY;
            default -> order.getStatus();
        };
        OrderStatusRequest req = new OrderStatusRequest();
        req.setStatus(next);
        return orderService.updateStatus(orderId, req);
    }
}`);

w('modules/kitchen/controller/KitchenController.java', `package com.restaurantmanagement.modules.kitchen.controller;
import com.restaurantmanagement.modules.kitchen.dto.KitchenOrderResponse;
import com.restaurantmanagement.modules.kitchen.service.KitchenService;
import com.restaurantmanagement.modules.orders.dto.OrderResponse;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/kitchen") @RequiredArgsConstructor
public class KitchenController {
    private final KitchenService kitchenService;

    @GetMapping("/active") @RequiresPermission(module = "kitchen", action = "view")
    public ResponseEntity<ApiResponse<KitchenOrderResponse>> listActive(@RequestParam Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(kitchenService.listActive(branchId)));
    }

    @PatchMapping("/orders/{id}/advance") @RequiresPermission(module = "kitchen", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> advance(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(kitchenService.advanceStatus(id)));
    }
}`);

console.log('Orders & Kitchen done');
