package com.restaurantmanagement.modules.kitchen.controller;
import com.restaurantmanagement.modules.kitchen.service.KitchenService;
import com.restaurantmanagement.modules.orders.dto.OrderResponse;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/kitchen") @RequiredArgsConstructor
public class KitchenController {
    private final KitchenService kitchenService;

    @GetMapping("/active") @RequiresPermission(module = "kitchen", action = "view")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> listActive(@RequestParam Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(kitchenService.listActive(branchId)));
    }

    @PatchMapping("/orders/{id}/advance") @RequiresPermission(module = "kitchen", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> advance(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(kitchenService.advanceStatus(id)));
    }
}
