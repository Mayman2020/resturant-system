package com.restaurantmanagement.modules.orders.controller;
import com.restaurantmanagement.modules.orders.dto.*;
import com.restaurantmanagement.modules.orders.service.OrderService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/orders") @RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping @RequiresPermission(module = "orders", action = "view")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> list(@RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.list(branchId)));
    }
    @GetMapping("/{id}") @RequiresPermission(module = "orders", action = "view")
    public ResponseEntity<ApiResponse<OrderResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getById(id)));
    }
    @PostMapping @RequiresPermission(module = "orders", action = "create")
    public ResponseEntity<ApiResponse<OrderResponse>> create(@Valid @RequestBody OrderRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(orderService.create(req)));
    }
    @PatchMapping("/{id}/status") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.updateStatus(id, req)));
    }
    @PatchMapping("/{id}/hold") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> hold(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean held) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.hold(id, held)));
    }
    @PostMapping("/{id}/split") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> split(@PathVariable Long id, @RequestBody List<Long> itemIds) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.split(id, itemIds)));
    }
    @PostMapping("/merge") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> merge(@Valid @RequestBody MergeOrdersRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.merge(req)));
    }
    @PostMapping("/{id}/checkout") @RequiresPermission(module = "orders", action = "edit")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(@PathVariable Long id, @Valid @RequestBody CheckoutRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.checkout(id, req)));
    }
}
