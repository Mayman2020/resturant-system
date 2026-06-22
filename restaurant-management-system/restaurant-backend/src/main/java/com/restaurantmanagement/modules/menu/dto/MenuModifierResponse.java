package com.restaurantmanagement.modules.menu.dto;
import com.restaurantmanagement.modules.menu.entity.ModifierType;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class MenuModifierResponse {
    private Long id; private Long menuItemId; private String name; private ModifierType modifierType;
    private BigDecimal priceAdjustment; private boolean active;
}
