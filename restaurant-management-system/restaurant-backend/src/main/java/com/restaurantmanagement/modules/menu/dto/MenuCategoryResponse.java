package com.restaurantmanagement.modules.menu.dto;
import com.restaurantmanagement.modules.menu.entity.CategoryType;
import lombok.Builder; import lombok.Data;
@Data @Builder public class MenuCategoryResponse {
    private Long id; private Long branchId; private String name; private CategoryType categoryType;
    private Integer sortOrder; private boolean active;
}
