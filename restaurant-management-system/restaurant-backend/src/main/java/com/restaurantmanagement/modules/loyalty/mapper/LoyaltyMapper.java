package com.restaurantmanagement.modules.loyalty.mapper;
import com.restaurantmanagement.modules.loyalty.dto.*;
import com.restaurantmanagement.modules.loyalty.entity.*;
public final class LoyaltyMapper {
    private LoyaltyMapper() {}
    public static LoyaltyPointsResponse toPoints(LoyaltyPoints p) {
        return LoyaltyPointsResponse.builder().id(p.getId()).customerId(p.getCustomerId())
                .points(p.getPoints()).tier(p.getTier()).lifetimePoints(p.getLifetimePoints()).build();
    }
    public static CouponResponse toCoupon(Coupon c) {
        return CouponResponse.builder().id(c.getId()).code(c.getCode()).description(c.getDescription())
                .discountType(c.getDiscountType()).discountValue(c.getDiscountValue()).minOrder(c.getMinOrder())
                .maxUses(c.getMaxUses()).usedCount(c.getUsedCount()).validFrom(c.getValidFrom())
                .validUntil(c.getValidUntil()).active(c.isActive()).build();
    }
}
