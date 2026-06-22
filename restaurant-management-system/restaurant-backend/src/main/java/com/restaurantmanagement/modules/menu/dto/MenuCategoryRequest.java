package com.restaurantmanagement.modules.menu.dto;
import com.restaurantmanagement.modules.menu.entity.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data public class MenuCategoryRequest {
    private Long branchId; @NotBlank private String name; @NotNull private CategoryType categoryType;
    private Integer sortOrder; private Boolean active;
}
