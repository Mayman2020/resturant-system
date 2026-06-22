package com.restaurantmanagement.modules.menu.dto;
import com.restaurantmanagement.modules.menu.entity.ModifierType;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal;
@Data public class MenuModifierRequest {
    @NotNull private Long menuItemId; @NotBlank private String name; @NotNull private ModifierType modifierType;
    private BigDecimal priceAdjustment; private Boolean active;
}
