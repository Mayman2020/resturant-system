package com.restaurantmanagement.modules.inventory.mapper;
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
}
