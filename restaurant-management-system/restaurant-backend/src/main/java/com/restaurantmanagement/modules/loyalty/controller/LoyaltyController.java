package com.restaurantmanagement.modules.loyalty.controller;
import com.restaurantmanagement.modules.loyalty.dto.*;
import com.restaurantmanagement.modules.loyalty.service.LoyaltyService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/loyalty") @RequiredArgsConstructor
public class LoyaltyController {
    private final LoyaltyService loyaltyService;
    @GetMapping("/customers/{customerId}/points") @RequiresPermission(module = "loyalty", action = "view")
    public ResponseEntity<ApiResponse<LoyaltyPointsResponse>> getPoints(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok(loyaltyService.getPoints(customerId)));
    }
    @PostMapping("/customers/{customerId}/points") @RequiresPermission(module = "loyalty", action = "edit")
    public ResponseEntity<ApiResponse<LoyaltyPointsResponse>> adjust(@PathVariable Long customerId, @Valid @RequestBody AdjustPointsRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(loyaltyService.adjustPoints(customerId, req)));
    }
    @GetMapping("/coupons") @RequiresPermission(module = "loyalty", action = "view")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> coupons() {
        return ResponseEntity.ok(ApiResponse.ok(loyaltyService.listCoupons()));
    }
    @PostMapping("/coupons") @RequiresPermission(module = "loyalty", action = "create")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CouponRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(loyaltyService.createCoupon(req)));
    }
}
