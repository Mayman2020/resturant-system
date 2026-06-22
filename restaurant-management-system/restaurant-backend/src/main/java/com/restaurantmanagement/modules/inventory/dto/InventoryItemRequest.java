package com.restaurantmanagement.modules.inventory.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal;
@Data public class InventoryItemRequest {
    @NotNull private Long branchId; @NotBlank private String name; @NotBlank private String unit;
    private BigDecimal currentStock; private BigDecimal minStock; private BigDecimal costPerUnit; private Boolean active;
}
