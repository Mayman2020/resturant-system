package com.restaurantmanagement.modules.orders.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.util.List; import java.util.Map;
@Data @Builder public class OrderItemResponse {
    private Long id; private Long menuItemId; private String itemName; private Integer quantity;
    private BigDecimal unitPrice; private BigDecimal lineTotal; private String notes;
    private List<Map<String, Object>> modifiers;
}
