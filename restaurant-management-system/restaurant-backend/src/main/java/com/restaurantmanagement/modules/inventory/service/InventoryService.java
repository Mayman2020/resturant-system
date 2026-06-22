package com.restaurantmanagement.modules.inventory.service;
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
}
