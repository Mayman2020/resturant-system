package com.restaurantmanagement.modules.delivery.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal;
@Data public class DeliveryRequest {
    @NotNull private Long orderId; @NotBlank private String deliveryAddress;
    private BigDecimal deliveryFee; private Integer estimatedMinutes;
}
