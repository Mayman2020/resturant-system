package com.restaurantmanagement.modules.permission.controller;

import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.modules.permission.dto.RolePermissionResponse;
import com.restaurantmanagement.modules.permission.dto.RolePermissionUpdateRequest;
import com.restaurantmanagement.modules.permission.service.RolePermissionService;
import com.restaurantmanagement.modules.users.entity.RoleType;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    @GetMapping
    @RequiresPermission(module = "settings", action = "view")
    public ResponseEntity<ApiResponse<List<RolePermissionResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(rolePermissionService.getAll()));
    }

    @GetMapping("/{role}")
    @RequiresPermission(module = "settings", action = "view")
    public ResponseEntity<ApiResponse<RolePermissionResponse>> getByRole(@PathVariable RoleType role) {
        return ResponseEntity.ok(ApiResponse.ok(rolePermissionService.getByRole(role)));
    }

    @PutMapping("/{role}")
    @RequiresPermission(module = "settings", action = "edit")
    public ResponseEntity<ApiResponse<RolePermissionResponse>> update(
            @PathVariable RoleType role,
            @Valid @RequestBody RolePermissionUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(rolePermissionService.update(role, request)));
    }
}
