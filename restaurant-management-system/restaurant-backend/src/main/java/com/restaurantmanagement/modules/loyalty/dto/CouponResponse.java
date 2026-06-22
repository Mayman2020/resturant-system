package com.restaurantmanagement.modules.loyalty.dto;
import com.restaurantmanagement.modules.loyalty.entity.DiscountType;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class CouponResponse {
    private Long id; private String code; private String description; private DiscountType discountType;
    private BigDecimal discountValue; private BigDecimal minOrder; private Integer maxUses; private Integer usedCount;
    private LocalDateTime validFrom; private LocalDateTime validUntil; private boolean active;
}
