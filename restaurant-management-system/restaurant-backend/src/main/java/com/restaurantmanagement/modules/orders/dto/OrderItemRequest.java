package com.restaurantmanagement.modules.orders.dto;
import lombok.Data; import java.math.BigDecimal; import java.util.List; import java.util.Map;
@Data public class OrderItemRequest {
    private Long menuItemId; private String itemName; private Integer quantity;
    private BigDecimal unitPrice; private String notes; private List<Map<String, Object>> modifiers;
}
