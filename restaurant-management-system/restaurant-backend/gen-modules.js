const fs = require('fs');
const path = require('path');
const BASE = path.join('d:', 'Apps Work', 'My Apps', 'resturant system', 'restaurant-management-system', 'restaurant-backend', 'src', 'main', 'java', 'com', 'restaurantmanagement');

function write(rel, content) {
  const full = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n', 'utf8');
  console.log('Wrote', rel);
}

// Tables module
write('modules/tables/dto/TableRequest.java', `package com.restaurantmanagement.modules.tables.dto;

import com.restaurantmanagement.modules.tables.entity.SeatingType;
import com.restaurantmanagement.modules.tables.entity.TableStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TableRequest {
    @NotNull private Long branchId;
    @NotBlank private String tableNumber;
    @NotNull private SeatingType seatingType;
    private Integer capacity;
    private TableStatus status;
    private String qrCode;
    private Boolean active;
}`);

write('modules/tables/dto/TableResponse.java', `package com.restaurantmanagement.modules.tables.dto;

import com.restaurantmanagement.modules.tables.entity.SeatingType;
import com.restaurantmanagement.modules.tables.entity.TableStatus;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class TableResponse {
    private Long id;
    private Long branchId;
    private String tableNumber;
    private SeatingType seatingType;
    private Integer capacity;
    private TableStatus status;
    private String qrCode;
    private boolean active;
}`);

write('modules/tables/mapper/TableMapper.java', `package com.restaurantmanagement.modules.tables.mapper;

import com.restaurantmanagement.modules.tables.dto.TableResponse;
import com.restaurantmanagement.modules.tables.entity.RestaurantTable;

public final class TableMapper {
    private TableMapper() {}
    public static TableResponse toResponse(RestaurantTable t) {
        return TableResponse.builder()
                .id(t.getId()).branchId(t.getBranchId()).tableNumber(t.getTableNumber())
                .seatingType(t.getSeatingType()).capacity(t.getCapacity())
                .status(t.getStatus()).qrCode(t.getQrCode()).active(t.isActive()).build();
    }
}`);

write('modules/tables/service/TableService.java', `package com.restaurantmanagement.modules.tables.service;

import com.restaurantmanagement.modules.tables.dto.TableRequest;
import com.restaurantmanagement.modules.tables.dto.TableResponse;
import com.restaurantmanagement.modules.tables.entity.RestaurantTable;
import com.restaurantmanagement.modules.tables.entity.TableStatus;
import com.restaurantmanagement.modules.tables.mapper.TableMapper;
import com.restaurantmanagement.modules.tables.repository.RestaurantTableRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class TableService {
    private final RestaurantTableRepository tableRepository;
    private final AppMessages appMessages;

    public List<TableResponse> getAll(Long branchId) {
        List<RestaurantTable> list = branchId != null ? tableRepository.findByBranchId(branchId) : tableRepository.findAll();
        return list.stream().map(TableMapper::toResponse).toList();
    }
    public TableResponse getById(Long id) { return TableMapper.toResponse(find(id)); }

    @Transactional
    public TableResponse create(TableRequest req) {
        RestaurantTable t = RestaurantTable.builder()
                .branchId(req.getBranchId()).tableNumber(req.getTableNumber())
                .seatingType(req.getSeatingType())
                .capacity(req.getCapacity() != null ? req.getCapacity() : 4)
                .status(req.getStatus() != null ? req.getStatus() : TableStatus.AVAILABLE)
                .qrCode(req.getQrCode()).active(req.getActive() == null || req.getActive()).build();
        return TableMapper.toResponse(tableRepository.save(t));
    }

    @Transactional
    public TableResponse update(Long id, TableRequest req) {
        RestaurantTable t = find(id);
        t.setBranchId(req.getBranchId()); t.setTableNumber(req.getTableNumber());
        t.setSeatingType(req.getSeatingType());
        if (req.getCapacity() != null) t.setCapacity(req.getCapacity());
        if (req.getStatus() != null) t.setStatus(req.getStatus());
        t.setQrCode(req.getQrCode());
        if (req.getActive() != null) t.setActive(req.getActive());
        return TableMapper.toResponse(tableRepository.save(t));
    }

    @Transactional public void delete(Long id) { tableRepository.delete(find(id)); }

    private RestaurantTable find(Long id) {
        return tableRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("table.not_found")));
    }
}`);

write('modules/tables/controller/TableController.java', `package com.restaurantmanagement.modules.tables.controller;

import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.modules.tables.dto.TableRequest;
import com.restaurantmanagement.modules.tables.dto.TableResponse;
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
}`);

console.log('Done tables');
