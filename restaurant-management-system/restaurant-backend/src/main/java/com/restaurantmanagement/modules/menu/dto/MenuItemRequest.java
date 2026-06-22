package com.restaurantmanagement.modules.menu.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal;
@Data public class MenuItemRequest {
    @NotNull private Long categoryId; @NotBlank private String name; private String description;
    private String imageUrl; @NotNull private BigDecimal price; private Integer preparationTime;
    private Boolean available; private Boolean active;
}
