package com.restaurantmanagement.modules.loyalty.dto;
import com.restaurantmanagement.modules.loyalty.entity.DiscountType;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data public class CouponRequest {
    @NotBlank private String code; private String description; @NotNull private DiscountType discountType;
    @NotNull private BigDecimal discountValue; private BigDecimal minOrder; private Integer maxUses;
    private LocalDateTime validFrom; private LocalDateTime validUntil; private Boolean active;
}
