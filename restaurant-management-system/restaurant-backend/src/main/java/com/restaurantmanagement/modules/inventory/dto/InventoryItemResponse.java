package com.restaurantmanagement.modules.inventory.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class InventoryItemResponse {
    private Long id; private Long branchId; private String name; private String unit;
    private BigDecimal currentStock; private BigDecimal minStock; private BigDecimal costPerUnit; private boolean active;
}
