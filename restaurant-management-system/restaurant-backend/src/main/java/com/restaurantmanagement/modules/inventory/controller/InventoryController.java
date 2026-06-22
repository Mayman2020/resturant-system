package com.restaurantmanagement.modules.inventory.controller;
import com.restaurantmanagement.modules.inventory.dto.*;
import com.restaurantmanagement.modules.inventory.service.InventoryService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/inventory") @RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;
    @GetMapping @RequiresPermission(module = "inventory", action = "view")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> list(@RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.listItems(branchId)));
    }
    @GetMapping("/low-stock") @RequiresPermission(module = "inventory", action = "view")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> lowStock(@RequestParam Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.lowStock(branchId)));
    }
    @PostMapping @RequiresPermission(module = "inventory", action = "create")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> create(@Valid @RequestBody InventoryItemRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(inventoryService.createItem(req)));
    }
    @PutMapping("/{id}") @RequiresPermission(module = "inventory", action = "edit")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> update(@PathVariable Long id, @Valid @RequestBody InventoryItemRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.updateItem(id, req)));
    }
    @DeleteMapping("/{id}") @RequiresPermission(module = "inventory", action = "delete")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        inventoryService.deleteItem(id); return ResponseEntity.ok(ApiResponse.ok(null));
    }
    @PostMapping("/movements") @RequiresPermission(module = "inventory", action = "edit")
    public ResponseEntity<ApiResponse<StockMovementResponse>> movement(@Valid @RequestBody StockMovementRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.recordMovement(req)));
    }
    @GetMapping("/{id}/movements") @RequiresPermission(module = "inventory", action = "view")
    public ResponseEntity<ApiResponse<List<StockMovementResponse>>> movements(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.listMovements(id)));
    }
}
