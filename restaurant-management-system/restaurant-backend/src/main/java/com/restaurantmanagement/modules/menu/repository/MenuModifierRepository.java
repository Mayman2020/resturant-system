package com.restaurantmanagement.modules.menu.repository;

import com.restaurantmanagement.modules.menu.entity.MenuModifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuModifierRepository extends JpaRepository<MenuModifier, Long> {
    List<MenuModifier> findByMenuItemId(Long menuItemId);
}
