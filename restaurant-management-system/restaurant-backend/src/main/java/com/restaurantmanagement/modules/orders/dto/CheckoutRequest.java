package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull; import lombok.Data; import java.math.BigDecimal;
@Data public class CheckoutRequest {
    @NotNull private PaymentMethod paymentMethod; @NotNull private BigDecimal amount;
    private String reference; private BigDecimal tipAmount; private String couponCode;
}
