package com.restaurantmanagement.modules.tables.dto;

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
}
