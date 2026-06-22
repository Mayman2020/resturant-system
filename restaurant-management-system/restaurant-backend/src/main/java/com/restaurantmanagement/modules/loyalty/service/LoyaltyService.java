package com.restaurantmanagement.modules.loyalty.service;
import com.restaurantmanagement.modules.loyalty.dto.*;
import com.restaurantmanagement.modules.loyalty.entity.*;
import com.restaurantmanagement.modules.loyalty.mapper.LoyaltyMapper;
import com.restaurantmanagement.modules.loyalty.repository.*;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor
public class LoyaltyService {
    private final LoyaltyPointsRepository loyaltyRepository;
    private final CouponRepository couponRepository;
    private final AppMessages appMessages;
    public LoyaltyPointsResponse getPoints(Long customerId) {
        return LoyaltyMapper.toPoints(loyaltyRepository.findByCustomerId(customerId)
                .orElseThrow(() -> AppException.notFound(appMessages.get("loyalty.not_found"))));
    }
    @Transactional public LoyaltyPointsResponse adjustPoints(Long customerId, AdjustPointsRequest req) {
        LoyaltyPoints lp = loyaltyRepository.findByCustomerId(customerId).orElseGet(() ->
                LoyaltyPoints.builder().customerId(customerId).points(0).lifetimePoints(0).build());
        lp.setPoints(lp.getPoints() + req.getPoints());
        if (req.getPoints() > 0) lp.setLifetimePoints(lp.getLifetimePoints() + req.getPoints());
        if (req.getTier() != null) lp.setTier(req.getTier());
        return LoyaltyMapper.toPoints(loyaltyRepository.save(lp));
    }
    public List<CouponResponse> listCoupons() {
        return couponRepository.findAll().stream().map(LoyaltyMapper::toCoupon).toList();
    }
    @Transactional public CouponResponse createCoupon(CouponRequest req) {
        Coupon c = Coupon.builder().code(req.getCode()).description(req.getDescription())
                .discountType(req.getDiscountType()).discountValue(req.getDiscountValue())
                .minOrder(req.getMinOrder() != null ? req.getMinOrder() : java.math.BigDecimal.ZERO)
                .maxUses(req.getMaxUses()).validFrom(req.getValidFrom()).validUntil(req.getValidUntil())
                .active(req.getActive() == null || req.getActive()).build();
        return LoyaltyMapper.toCoupon(couponRepository.save(c));
    }
}
