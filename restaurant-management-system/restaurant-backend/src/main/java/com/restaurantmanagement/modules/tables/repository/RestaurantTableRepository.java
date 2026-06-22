package com.restaurantmanagement.modules.tables.repository;

import com.restaurantmanagement.modules.tables.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByBranchId(Long branchId);
    Optional<RestaurantTable> findByQrCode(String qrCode);
    Optional<RestaurantTable> findByBranchIdAndTableNumber(Long branchId, String tableNumber);
}
