package com.restaurantmanagement.modules.menu.service;
import com.restaurantmanagement.modules.menu.dto.*;
import com.restaurantmanagement.modules.menu.entity.*;
import com.restaurantmanagement.modules.menu.mapper.MenuMapper;
import com.restaurantmanagement.modules.menu.repository.*;
import com.restaurantmanagement.modules.tables.entity.RestaurantTable;
import com.restaurantmanagement.modules.tables.repository.RestaurantTableRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
@Service @RequiredArgsConstructor
public class MenuService {
    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;
    private final MenuModifierRepository modifierRepository;
    private final RestaurantTableRepository tableRepository;
    private final AppMessages appMessages;

    public List<MenuCategoryResponse> listCategories(Long branchId) {
        return (branchId != null ? categoryRepository.findByBranchIdOrderBySortOrderAsc(branchId) : categoryRepository.findAll())
                .stream().map(MenuMapper::toCategory).toList();
    }
    public MenuCategoryResponse getCategory(Long id) {
        return MenuMapper.toCategory(categoryRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("menu.category.not_found"))));
    }
    @Transactional public MenuCategoryResponse createCategory(MenuCategoryRequest req) {
        MenuCategory c = MenuCategory.builder().branchId(req.getBranchId()).name(req.getName())
                .categoryType(req.getCategoryType()).sortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0)
                .active(req.getActive() == null || req.getActive()).build();
        return MenuMapper.toCategory(categoryRepository.save(c));
    }
    @Transactional public MenuCategoryResponse updateCategory(Long id, MenuCategoryRequest req) {
        MenuCategory c = categoryRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("menu.category.not_found")));
        c.setBranchId(req.getBranchId()); c.setName(req.getName()); c.setCategoryType(req.getCategoryType());
        if (req.getSortOrder() != null) c.setSortOrder(req.getSortOrder());
        if (req.getActive() != null) c.setActive(req.getActive());
        return MenuMapper.toCategory(categoryRepository.save(c));
    }
    @Transactional public void deleteCategory(Long id) { categoryRepository.delete(getCategoryEntity(id)); }

    public List<MenuItemResponse> listItems(Long categoryId) {
        return (categoryId != null ? itemRepository.findByCategoryId(categoryId) : itemRepository.findAll())
                .stream().map(MenuMapper::toItem).toList();
    }
    public MenuItemResponse getItem(Long id) {
        return MenuMapper.toItem(itemRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("menu.item.not_found"))));
    }
    @Transactional public MenuItemResponse createItem(MenuItemRequest req) {
        MenuItem i = MenuItem.builder().categoryId(req.getCategoryId()).name(req.getName()).description(req.getDescription())
                .imageUrl(req.getImageUrl()).price(req.getPrice())
                .preparationTime(req.getPreparationTime() != null ? req.getPreparationTime() : 15)
                .available(req.getAvailable() == null || req.getAvailable())
                .active(req.getActive() == null || req.getActive()).build();
        return MenuMapper.toItem(itemRepository.save(i));
    }
    @Transactional public MenuItemResponse updateItem(Long id, MenuItemRequest req) {
        MenuItem i = itemRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("menu.item.not_found")));
        i.setCategoryId(req.getCategoryId()); i.setName(req.getName()); i.setDescription(req.getDescription());
        i.setImageUrl(req.getImageUrl()); i.setPrice(req.getPrice());
        if (req.getPreparationTime() != null) i.setPreparationTime(req.getPreparationTime());
        if (req.getAvailable() != null) i.setAvailable(req.getAvailable());
        if (req.getActive() != null) i.setActive(req.getActive());
        return MenuMapper.toItem(itemRepository.save(i));
    }
    @Transactional public void deleteItem(Long id) { itemRepository.deleteById(id); }

    public List<MenuModifierResponse> listModifiers(Long menuItemId) {
        return (menuItemId != null ? modifierRepository.findByMenuItemId(menuItemId) : modifierRepository.findAll())
                .stream().map(MenuMapper::toModifier).toList();
    }
    @Transactional public MenuModifierResponse createModifier(MenuModifierRequest req) {
        MenuModifier m = MenuModifier.builder().menuItemId(req.getMenuItemId()).name(req.getName())
                .modifierType(req.getModifierType())
                .priceAdjustment(req.getPriceAdjustment() != null ? req.getPriceAdjustment() : BigDecimal.ZERO)
                .active(req.getActive() == null || req.getActive()).build();
        return MenuMapper.toModifier(modifierRepository.save(m));
    }
    @Transactional public MenuModifierResponse updateModifier(Long id, MenuModifierRequest req) {
        MenuModifier m = modifierRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("menu.modifier.not_found")));
        m.setMenuItemId(req.getMenuItemId()); m.setName(req.getName()); m.setModifierType(req.getModifierType());
        if (req.getPriceAdjustment() != null) m.setPriceAdjustment(req.getPriceAdjustment());
        if (req.getActive() != null) m.setActive(req.getActive());
        return MenuMapper.toModifier(modifierRepository.save(m));
    }
    @Transactional public void deleteModifier(Long id) { modifierRepository.deleteById(id); }

    public QrMenuResponse getQrMenu(String qrCode) {
        RestaurantTable table = tableRepository.findByQrCode(qrCode)
                .orElseThrow(() -> AppException.notFound("QR menu not found"));
        Long branchId = table.getBranchId();
        List<MenuCategoryResponse> categories = listCategories(branchId);
        List<MenuItemResponse> items = categories.stream()
                .flatMap(c -> itemRepository.findByCategoryId(c.getId()).stream()
                        .filter(i -> i.isAvailable() && i.isActive())
                        .map(MenuMapper::toItem)).toList();
        List<MenuModifierResponse> modifiers = items.stream()
                .flatMap(i -> modifierRepository.findByMenuItemId(i.getId()).stream().map(MenuMapper::toModifier)).toList();
        return QrMenuResponse.builder().tableNumber(table.getTableNumber()).branchId(branchId)
                .categories(categories).items(items).modifiers(modifiers).build();
    }
    private MenuCategory getCategoryEntity(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("menu.category.not_found")));
    }
}
