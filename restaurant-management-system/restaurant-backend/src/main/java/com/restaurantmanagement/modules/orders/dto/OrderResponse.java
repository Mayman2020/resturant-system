package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import com.restaurantmanagement.modules.orders.entity.OrderType;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime; import java.util.List;
@Data @Builder public class OrderResponse {
    private Long id; private String orderNumber; private Long branchId; private Long tableId;
    private Long customerId; private Long waiterId; private OrderType orderType; private OrderStatus status;
    private BigDecimal subtotal; private BigDecimal discountAmount; private BigDecimal taxAmount;
    private BigDecimal serviceCharge; private BigDecimal tipAmount; private BigDecimal totalAmount;
    private String notes; private boolean held; private LocalDateTime createdAt; private List<OrderItemResponse> items;
}
