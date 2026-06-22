package com.restaurantmanagement.modules.delivery.controller;
import com.restaurantmanagement.modules.delivery.dto.*;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import com.restaurantmanagement.modules.delivery.service.DeliveryService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/delivery") @RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService deliveryService;
    @GetMapping @RequiresPermission(module = "delivery", action = "view")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> list(
            @RequestParam(required = false) DeliveryStatus status,
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.list(status, branchId)));
    }
    @GetMapping("/order/{orderId}") @RequiresPermission(module = "delivery", action = "view")
    public ResponseEntity<ApiResponse<DeliveryResponse>> byOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.getByOrderId(orderId)));
    }
    @PostMapping @RequiresPermission(module = "delivery", action = "create")
    public ResponseEntity<ApiResponse<DeliveryResponse>> create(@Valid @RequestBody DeliveryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(deliveryService.create(req)));
    }
    @PatchMapping("/{id}/assign") @RequiresPermission(module = "delivery", action = "edit")
    public ResponseEntity<ApiResponse<DeliveryResponse>> assign(@PathVariable Long id, @Valid @RequestBody AssignDriverRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.assignDriver(id, req)));
    }
    @PatchMapping("/{id}/status") @RequiresPermission(module = "delivery", action = "edit")
    public ResponseEntity<ApiResponse<DeliveryResponse>> status(@PathVariable Long id, @Valid @RequestBody DeliveryStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.updateStatus(id, req)));
    }
}
