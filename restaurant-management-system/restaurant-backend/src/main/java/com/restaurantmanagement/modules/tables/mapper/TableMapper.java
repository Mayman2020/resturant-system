package com.restaurantmanagement.modules.tables.mapper;

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
}
