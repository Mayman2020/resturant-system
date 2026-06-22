package com.restaurantmanagement.modules.menu.controller;
import com.restaurantmanagement.modules.menu.dto.*;
import com.restaurantmanagement.modules.menu.service.MenuService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/menu") @RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;

    @GetMapping("/categories") @RequiresPermission(module = "menu", action = "view")
    public ResponseEntity<ApiResponse<List<MenuCategoryResponse>>> listCategories(@RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.listCategories(branchId)));
    }
    @PostMapping("/categories") @RequiresPermission(module = "menu", action = "create")
    public ResponseEntity<ApiResponse<MenuCategoryResponse>> createCategory(@Valid @RequestBody MenuCategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(menuService.createCategory(req)));
    }
    @PutMapping("/categories/{id}") @RequiresPermission(module = "menu", action = "edit")
    public ResponseEntity<ApiResponse<MenuCategoryResponse>> updateCategory(@PathVariable Long id, @Valid @RequestBody MenuCategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.updateCategory(id, req)));
    }
    @DeleteMapping("/categories/{id}") @RequiresPermission(module = "menu", action = "delete")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id); return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/items") @RequiresPermission(module = "menu", action = "view")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> listItems(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.listItems(categoryId)));
    }
    @PostMapping("/items") @RequiresPermission(module = "menu", action = "create")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createItem(@Valid @RequestBody MenuItemRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(menuService.createItem(req)));
    }
    @PutMapping("/items/{id}") @RequiresPermission(module = "menu", action = "edit")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.updateItem(id, req)));
    }
    @DeleteMapping("/items/{id}") @RequiresPermission(module = "menu", action = "delete")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        menuService.deleteItem(id); return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/modifiers") @RequiresPermission(module = "menu", action = "view")
    public ResponseEntity<ApiResponse<List<MenuModifierResponse>>> listModifiers(@RequestParam(required = false) Long menuItemId) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.listModifiers(menuItemId)));
    }
    @PostMapping("/modifiers") @RequiresPermission(module = "menu", action = "create")
    public ResponseEntity<ApiResponse<MenuModifierResponse>> createModifier(@Valid @RequestBody MenuModifierRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(menuService.createModifier(req)));
    }
    @PutMapping("/modifiers/{id}") @RequiresPermission(module = "menu", action = "edit")
    public ResponseEntity<ApiResponse<MenuModifierResponse>> updateModifier(@PathVariable Long id, @Valid @RequestBody MenuModifierRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.updateModifier(id, req)));
    }
    @DeleteMapping("/modifiers/{id}") @RequiresPermission(module = "menu", action = "delete")
    public ResponseEntity<ApiResponse<Void>> deleteModifier(@PathVariable Long id) {
        menuService.deleteModifier(id); return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<ApiResponse<QrMenuResponse>> qrMenu(@PathVariable String qrCode) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getQrMenu(qrCode)));
    }
}
