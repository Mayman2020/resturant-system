package com.restaurantmanagement.modules.delivery.dto;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class DeliveryResponse {
    private Long id; private Long orderId; private Long driverId; private String deliveryAddress;
    private BigDecimal deliveryFee; private Integer estimatedMinutes; private DeliveryStatus status;
    private LocalDateTime assignedAt; private LocalDateTime deliveredAt;
}
