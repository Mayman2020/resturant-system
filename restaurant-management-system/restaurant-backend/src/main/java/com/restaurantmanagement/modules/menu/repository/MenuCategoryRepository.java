package com.restaurantmanagement.modules.menu.repository;

import com.restaurantmanagement.modules.menu.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByBranchIdOrderBySortOrderAsc(Long branchId);
}
