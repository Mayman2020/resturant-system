package com.restaurantmanagement.modules.settings.controller;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.modules.settings.dto.*;
import com.restaurantmanagement.modules.settings.service.SettingsService;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/settings") @RequiredArgsConstructor
public class SettingsController {
    private final SettingsService settingsService;
    @GetMapping @RequiresPermission(module = "settings", action = "view")
    public ResponseEntity<ApiResponse<List<BranchSettingResponse>>> list(@RequestParam Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(settingsService.list(branchId)));
    }
    @PostMapping @RequiresPermission(module = "settings", action = "edit")
    public ResponseEntity<ApiResponse<BranchSettingResponse>> upsert(@Valid @RequestBody BranchSettingRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(settingsService.upsert(req)));
    }
    @DeleteMapping("/{id}") @RequiresPermission(module = "settings", action = "delete")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        settingsService.delete(id); return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
