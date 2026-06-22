package com.restaurantmanagement.modules.branches.controller;

import com.restaurantmanagement.modules.branches.dto.BranchRequest;
import com.restaurantmanagement.modules.branches.dto.BranchResponse;
import com.restaurantmanagement.modules.branches.service.BranchService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    @GetMapping
    @RequiresPermission(module = "branches", action = "view")
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getAll()));
    }

    @GetMapping("/{id}")
    @RequiresPermission(module = "branches", action = "view")
    public ResponseEntity<ApiResponse<BranchResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getById(id)));
    }

    @PostMapping
    @RequiresPermission(module = "branches", action = "create")
    public ResponseEntity<ApiResponse<BranchResponse>> create(@Valid @RequestBody BranchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(branchService.create(request)));
    }

    @PutMapping("/{id}")
    @RequiresPermission(module = "branches", action = "edit")
    public ResponseEntity<ApiResponse<BranchResponse>> update(@PathVariable Long id, @Valid @RequestBody BranchRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(branchService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @RequiresPermission(module = "branches", action = "delete")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        branchService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
