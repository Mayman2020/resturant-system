package com.restaurantmanagement.modules.menu.dto;
import lombok.Builder; import lombok.Data;
import java.util.List;
@Data @Builder public class QrMenuResponse {
    private String tableNumber; private Long branchId;
    private List<MenuCategoryResponse> categories;
    private List<MenuItemResponse> items;
    private List<MenuModifierResponse> modifiers;
}
