package com.restaurantmanagement.modules.billing.controller;
import com.restaurantmanagement.modules.billing.dto.ReceiptResponse;
import com.restaurantmanagement.modules.billing.service.BillingService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/billing") @RequiredArgsConstructor
public class BillingController {
    private final BillingService billingService;
    @GetMapping("/receipts") @RequiresPermission(module = "billing", action = "view")
    public ResponseEntity<ApiResponse<List<ReceiptResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(billingService.list()));
    }
    @GetMapping("/receipts/{id}") @RequiresPermission(module = "billing", action = "view")
    public ResponseEntity<ApiResponse<ReceiptResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(billingService.getById(id)));
    }
    @PostMapping("/orders/{orderId}/receipt") @RequiresPermission(module = "billing", action = "create")
    public ResponseEntity<ApiResponse<ReceiptResponse>> generate(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(billingService.generate(orderId)));
    }
}
