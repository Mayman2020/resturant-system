const fs = require('fs');
const path = require('path');
const BASE = path.join('d:', 'Apps Work', 'My Apps', 'resturant system', 'restaurant-management-system', 'restaurant-backend', 'src', 'main', 'java', 'com', 'restaurantmanagement');
function w(rel, content) {
  const full = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n', 'utf8');
  console.log('Wrote', rel);
}

// Inventory
w('modules/inventory/dto/InventoryItemRequest.java', `package com.restaurantmanagement.modules.inventory.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal;
@Data public class InventoryItemRequest {
    @NotNull private Long branchId; @NotBlank private String name; @NotBlank private String unit;
    private BigDecimal currentStock; private BigDecimal minStock; private BigDecimal costPerUnit; private Boolean active;
}`);
w('modules/inventory/dto/InventoryItemResponse.java', `package com.restaurantmanagement.modules.inventory.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class InventoryItemResponse {
    private Long id; private Long branchId; private String name; private String unit;
    private BigDecimal currentStock; private BigDecimal minStock; private BigDecimal costPerUnit; private boolean active;
}`);
w('modules/inventory/dto/StockMovementRequest.java', `package com.restaurantmanagement.modules.inventory.dto;
import com.restaurantmanagement.modules.inventory.entity.MovementType;
import jakarta.validation.constraints.NotNull; import lombok.Data; import java.math.BigDecimal;
@Data public class StockMovementRequest {
    @NotNull private Long inventoryItemId; @NotNull private MovementType movementType;
    @NotNull private BigDecimal quantity; private String reference; private String notes;
}`);
w('modules/inventory/dto/StockMovementResponse.java', `package com.restaurantmanagement.modules.inventory.dto;
import com.restaurantmanagement.modules.inventory.entity.MovementType;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class StockMovementResponse {
    private Long id; private Long inventoryItemId; private MovementType movementType;
    private BigDecimal quantity; private String reference; private String notes; private LocalDateTime createdAt;
}`);
w('modules/inventory/mapper/InventoryMapper.java', `package com.restaurantmanagement.modules.inventory.mapper;
import com.restaurantmanagement.modules.inventory.dto.*;
import com.restaurantmanagement.modules.inventory.entity.*;
public final class InventoryMapper {
    private InventoryMapper() {}
    public static InventoryItemResponse toItem(InventoryItem i) {
        return InventoryItemResponse.builder().id(i.getId()).branchId(i.getBranchId()).name(i.getName())
                .unit(i.getUnit()).currentStock(i.getCurrentStock()).minStock(i.getMinStock())
                .costPerUnit(i.getCostPerUnit()).active(i.isActive()).build();
    }
    public static StockMovementResponse toMovement(StockMovement m) {
        return StockMovementResponse.builder().id(m.getId()).inventoryItemId(m.getInventoryItemId())
                .movementType(m.getMovementType()).quantity(m.getQuantity()).reference(m.getReference())
                .notes(m.getNotes()).createdAt(m.getCreatedAt()).build();
    }
}`);
w('modules/inventory/service/InventoryService.java', `package com.restaurantmanagement.modules.inventory.service;
import com.restaurantmanagement.modules.inventory.dto.*;
import com.restaurantmanagement.modules.inventory.entity.*;
import com.restaurantmanagement.modules.inventory.mapper.InventoryMapper;
import com.restaurantmanagement.modules.inventory.repository.*;
import com.restaurantmanagement.modules.users.entity.User;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal; import java.util.List;
@Service @RequiredArgsConstructor
public class InventoryService {
    private final InventoryItemRepository inventoryRepository;
    private final StockMovementRepository movementRepository;
    private final AppMessages appMessages;
    public List<InventoryItemResponse> listItems(Long branchId) {
        return (branchId != null ? inventoryRepository.findByBranchId(branchId) : inventoryRepository.findAll())
                .stream().map(InventoryMapper::toItem).toList();
    }
    public List<InventoryItemResponse> lowStock(Long branchId) {
        return inventoryRepository.findLowStockByBranchId(branchId).stream().map(InventoryMapper::toItem).toList();
    }
    @Transactional public InventoryItemResponse createItem(InventoryItemRequest req) {
        InventoryItem item = InventoryItem.builder().branchId(req.getBranchId()).name(req.getName()).unit(req.getUnit())
                .currentStock(req.getCurrentStock() != null ? req.getCurrentStock() : BigDecimal.ZERO)
                .minStock(req.getMinStock() != null ? req.getMinStock() : BigDecimal.ZERO)
                .costPerUnit(req.getCostPerUnit() != null ? req.getCostPerUnit() : BigDecimal.ZERO)
                .active(req.getActive() == null || req.getActive()).build();
        return InventoryMapper.toItem(inventoryRepository.save(item));
    }
    @Transactional public InventoryItemResponse updateItem(Long id, InventoryItemRequest req) {
        InventoryItem item = inventoryRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("inventory.not_found")));
        item.setBranchId(req.getBranchId()); item.setName(req.getName()); item.setUnit(req.getUnit());
        if (req.getCurrentStock() != null) item.setCurrentStock(req.getCurrentStock());
        if (req.getMinStock() != null) item.setMinStock(req.getMinStock());
        if (req.getCostPerUnit() != null) item.setCostPerUnit(req.getCostPerUnit());
        if (req.getActive() != null) item.setActive(req.getActive());
        return InventoryMapper.toItem(inventoryRepository.save(item));
    }
    @Transactional public void deleteItem(Long id) { inventoryRepository.deleteById(id); }
    @Transactional public StockMovementResponse recordMovement(StockMovementRequest req) {
        InventoryItem item = inventoryRepository.findById(req.getInventoryItemId())
                .orElseThrow(() -> AppException.notFound(appMessages.get("inventory.not_found")));
        BigDecimal qty = req.getQuantity();
        if (req.getMovementType() == MovementType.STOCK_IN || req.getMovementType() == MovementType.ADJUSTMENT) {
            item.setCurrentStock(item.getCurrentStock().add(qty));
        } else {
            item.setCurrentStock(item.getCurrentStock().subtract(qty));
        }
        inventoryRepository.save(item);
        Long userId = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User u) userId = u.getId();
        StockMovement movement = StockMovement.builder().inventoryItemId(req.getInventoryItemId())
                .movementType(req.getMovementType()).quantity(qty).reference(req.getReference())
                .notes(req.getNotes()).createdBy(userId).build();
        return InventoryMapper.toMovement(movementRepository.save(movement));
    }
    public List<StockMovementResponse> listMovements(Long inventoryItemId) {
        return movementRepository.findByInventoryItemIdOrderByCreatedAtDesc(inventoryItemId)
                .stream().map(InventoryMapper::toMovement).toList();
    }
}`);
w('modules/inventory/controller/InventoryController.java', `package com.restaurantmanagement.modules.inventory.controller;
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
}`);

// Billing
w('modules/billing/dto/ReceiptResponse.java', `package com.restaurantmanagement.modules.billing.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class ReceiptResponse {
    private Long id; private Long orderId; private String receiptNumber; private BigDecimal subtotal;
    private BigDecimal taxAmount; private BigDecimal serviceCharge; private BigDecimal tipAmount;
    private BigDecimal discountAmount; private BigDecimal totalAmount; private LocalDateTime printedAt; private LocalDateTime createdAt;
}`);
w('modules/billing/mapper/ReceiptMapper.java', `package com.restaurantmanagement.modules.billing.mapper;
import com.restaurantmanagement.modules.billing.dto.ReceiptResponse;
import com.restaurantmanagement.modules.billing.entity.Receipt;
public final class ReceiptMapper {
    private ReceiptMapper() {}
    public static ReceiptResponse toResponse(Receipt r) {
        return ReceiptResponse.builder().id(r.getId()).orderId(r.getOrderId()).receiptNumber(r.getReceiptNumber())
                .subtotal(r.getSubtotal()).taxAmount(r.getTaxAmount()).serviceCharge(r.getServiceCharge())
                .tipAmount(r.getTipAmount()).discountAmount(r.getDiscountAmount()).totalAmount(r.getTotalAmount())
                .printedAt(r.getPrintedAt()).createdAt(r.getCreatedAt()).build();
    }
}`);
w('modules/billing/service/BillingService.java', `package com.restaurantmanagement.modules.billing.service;
import com.restaurantmanagement.modules.billing.dto.ReceiptResponse;
import com.restaurantmanagement.modules.billing.entity.Receipt;
import com.restaurantmanagement.modules.billing.mapper.ReceiptMapper;
import com.restaurantmanagement.modules.billing.repository.ReceiptRepository;
import com.restaurantmanagement.modules.orders.entity.OrderEntity;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime; import java.util.List;
@Service @RequiredArgsConstructor
public class BillingService {
    private final ReceiptRepository receiptRepository;
    private final OrderRepository orderRepository;
    private final AppMessages appMessages;
    public List<ReceiptResponse> list() {
        return receiptRepository.findAll().stream().map(ReceiptMapper::toResponse).toList();
    }
    public ReceiptResponse getById(Long id) {
        return ReceiptMapper.toResponse(receiptRepository.findById(id)
                .orElseThrow(() -> AppException.notFound(appMessages.get("receipt.not_found"))));
    }
    @Transactional public ReceiptResponse generate(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> AppException.notFound(appMessages.get("order.not_found")));
        Receipt receipt = Receipt.builder().orderId(orderId).receiptNumber("RCP-" + System.currentTimeMillis())
                .subtotal(order.getSubtotal()).taxAmount(order.getTaxAmount()).serviceCharge(order.getServiceCharge())
                .tipAmount(order.getTipAmount()).discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount()).printedAt(LocalDateTime.now()).build();
        return ReceiptMapper.toResponse(receiptRepository.save(receipt));
    }
}`);
w('modules/billing/controller/BillingController.java', `package com.restaurantmanagement.modules.billing.controller;
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
}`);

// Settings
w('modules/settings/dto/BranchSettingRequest.java', `package com.restaurantmanagement.modules.settings.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data public class BranchSettingRequest {
    @NotNull private Long branchId; @NotBlank private String settingKey; private String settingValue;
}`);
w('modules/settings/dto/BranchSettingResponse.java', `package com.restaurantmanagement.modules.settings.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class BranchSettingResponse {
    private Long id; private Long branchId; private String settingKey; private String settingValue;
}`);
w('modules/settings/service/SettingsService.java', `package com.restaurantmanagement.modules.settings.service;
import com.restaurantmanagement.modules.settings.dto.*;
import com.restaurantmanagement.modules.settings.entity.BranchSetting;
import com.restaurantmanagement.modules.settings.repository.BranchSettingRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor
public class SettingsService {
    private final BranchSettingRepository settingRepository;
    private final AppMessages appMessages;
    public List<BranchSettingResponse> list(Long branchId) {
        return settingRepository.findByBranchId(branchId).stream().map(this::toResponse).toList();
    }
    @Transactional public BranchSettingResponse upsert(BranchSettingRequest req) {
        BranchSetting s = settingRepository.findByBranchIdAndSettingKey(req.getBranchId(), req.getSettingKey())
                .orElse(BranchSetting.builder().branchId(req.getBranchId()).settingKey(req.getSettingKey()).build());
        s.setSettingValue(req.getSettingValue());
        return toResponse(settingRepository.save(s));
    }
    @Transactional public void delete(Long id) {
        settingRepository.deleteById(id);
    }
    private BranchSettingResponse toResponse(BranchSetting s) {
        return BranchSettingResponse.builder().id(s.getId()).branchId(s.getBranchId())
                .settingKey(s.getSettingKey()).settingValue(s.getSettingValue()).build();
    }
}`);
w('modules/settings/controller/SettingsController.java', `package com.restaurantmanagement.modules.settings.controller;
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
}`);

console.log('Inventory, Billing, Settings done');
