package com.restaurantmanagement.modules.tables.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationRequest {
    @NotNull private Long tableId;
    @NotBlank private String customerName;
    private String customerPhone;
    @NotNull private Integer partySize;
    @NotNull private LocalDateTime reservedAt;
    private String status;
    private String notes;
}
