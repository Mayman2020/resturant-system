package com.restaurantmanagement.modules.inventory.dto;
import com.restaurantmanagement.modules.inventory.entity.MovementType;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class StockMovementResponse {
    private Long id; private Long inventoryItemId; private MovementType movementType;
    private BigDecimal quantity; private String reference; private String notes; private LocalDateTime createdAt;
}
