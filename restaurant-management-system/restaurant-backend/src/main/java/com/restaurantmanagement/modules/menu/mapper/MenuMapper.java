package com.restaurantmanagement.modules.menu.mapper;
import com.restaurantmanagement.modules.menu.dto.*;
import com.restaurantmanagement.modules.menu.entity.*;
public final class MenuMapper {
    private MenuMapper() {}
    public static MenuCategoryResponse toCategory(MenuCategory c) {
        return MenuCategoryResponse.builder().id(c.getId()).branchId(c.getBranchId()).name(c.getName())
                .categoryType(c.getCategoryType()).sortOrder(c.getSortOrder()).active(c.isActive()).build();
    }
    public static MenuItemResponse toItem(MenuItem i) {
        return MenuItemResponse.builder().id(i.getId()).categoryId(i.getCategoryId()).name(i.getName())
                .description(i.getDescription()).imageUrl(i.getImageUrl()).price(i.getPrice())
                .preparationTime(i.getPreparationTime()).available(i.isAvailable()).active(i.isActive()).build();
    }
    public static MenuModifierResponse toModifier(MenuModifier m) {
        return MenuModifierResponse.builder().id(m.getId()).menuItemId(m.getMenuItemId()).name(m.getName())
                .modifierType(m.getModifierType()).priceAdjustment(m.getPriceAdjustment()).active(m.isActive()).build();
    }
}
