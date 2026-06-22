package com.restaurantmanagement.modules.kitchen.service;
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

    public List<OrderResponse> listActive(Long branchId) {
        return orderRepository.findActiveKitchenOrders(branchId, ACTIVE)
                .stream().map(OrderMapper::toResponse).toList();
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
}
