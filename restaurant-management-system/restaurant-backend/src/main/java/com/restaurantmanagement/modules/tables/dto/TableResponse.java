package com.restaurantmanagement.modules.tables.dto;

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
}
