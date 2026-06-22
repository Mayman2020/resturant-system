package com.restaurantmanagement.modules.inventory.dto;
import com.restaurantmanagement.modules.inventory.entity.MovementType;
import jakarta.validation.constraints.NotNull; import lombok.Data; import java.math.BigDecimal;
@Data public class StockMovementRequest {
    @NotNull private Long inventoryItemId; @NotNull private MovementType movementType;
    @NotNull private BigDecimal quantity; private String reference; private String notes;
}
