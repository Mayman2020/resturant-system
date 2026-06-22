package com.restaurantmanagement.modules.inventory.repository;

import com.restaurantmanagement.modules.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByInventoryItemIdOrderByCreatedAtDesc(Long inventoryItemId);
}
