package com.restaurantmanagement.modules.tables.controller;

import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.modules.tables.dto.ReservationRequest;
import com.restaurantmanagement.modules.tables.dto.TableRequest;
import com.restaurantmanagement.modules.tables.dto.TableResponse;
import com.restaurantmanagement.modules.tables.dto.ReservationResponse;
import com.restaurantmanagement.modules.tables.service.TableService;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/tables") @RequiredArgsConstructor
public class TableController {
    private final TableService tableService;

    @GetMapping @RequiresPermission(module = "tables", action = "view")
    public ResponseEntity<ApiResponse<List<TableResponse>>> getAll(@RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.getAll(branchId)));
    }

    @GetMapping("/reservations") @RequiresPermission(module = "tables", action = "view")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getReservations(@RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.getReservations(branchId)));
    }

    @PostMapping("/reservations") @RequiresPermission(module = "tables", action = "create")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(@Valid @RequestBody ReservationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(tableService.createReservation(req)));
    }

    @PutMapping("/reservations/{id}") @RequiresPermission(module = "tables", action = "edit")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservation(@PathVariable Long id, @Valid @RequestBody ReservationRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.updateReservation(id, req)));
    }

    @DeleteMapping("/reservations/{id}") @RequiresPermission(module = "tables", action = "delete")
    public ResponseEntity<ApiResponse<Void>> cancelReservation(@PathVariable Long id) {
        tableService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/{id}") @RequiresPermission(module = "tables", action = "view")
    public ResponseEntity<ApiResponse<TableResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.getById(id)));
    }
    @PostMapping @RequiresPermission(module = "tables", action = "create")
    public ResponseEntity<ApiResponse<TableResponse>> create(@Valid @RequestBody TableRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(tableService.create(req)));
    }
    @PutMapping("/{id}") @RequiresPermission(module = "tables", action = "edit")
    public ResponseEntity<ApiResponse<TableResponse>> update(@PathVariable Long id, @Valid @RequestBody TableRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.update(id, req)));
    }
    @DeleteMapping("/{id}") @RequiresPermission(module = "tables", action = "delete")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        tableService.delete(id); return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
