package com.restaurantmanagement.modules.tables.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class ReservationResponse {
    private Long id;
    private Long tableId;
    private String customerName;
    private String customerPhone;
    private Integer partySize;
    private LocalDateTime reservedAt;
    private String status;
    private String notes;
}
