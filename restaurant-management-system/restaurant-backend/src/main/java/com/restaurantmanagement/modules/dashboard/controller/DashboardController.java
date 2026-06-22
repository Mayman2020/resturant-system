package com.restaurantmanagement.modules.dashboard.controller;
import com.restaurantmanagement.modules.dashboard.dto.DashboardSummaryResponse;
import com.restaurantmanagement.modules.dashboard.service.DashboardService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/dashboard") @RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/summary") @RequiresPermission(module = "dashboard", action = "view")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> summary(@RequestParam(required = false) Long branchId) {
        Long effectiveBranchId = branchId != null ? branchId : 1L;
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.summary(effectiveBranchId)));
    }
}
