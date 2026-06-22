package com.restaurantmanagement.modules.orders.repository;

import com.restaurantmanagement.modules.orders.entity.OrderEntity;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Optional<OrderEntity> findByOrderNumber(String orderNumber);

    List<OrderEntity> findByBranchIdAndStatusIn(Long branchId, List<OrderStatus> statuses);

    @Query("SELECT o FROM OrderEntity o WHERE o.branchId = :branchId AND o.status IN :statuses AND o.held = false ORDER BY o.createdAt ASC")
    List<OrderEntity> findActiveKitchenOrders(@Param("branchId") Long branchId, @Param("statuses") List<OrderStatus> statuses);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE o.branchId = :branchId AND o.createdAt BETWEEN :from AND :to")
    long countByBranchAndPeriod(@Param("branchId") Long branchId, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM OrderEntity o WHERE o.branchId = :branchId AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :from AND :to")
    java.math.BigDecimal sumCompletedSales(@Param("branchId") Long branchId, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    List<OrderEntity> findByBranchIdOrderByCreatedAtDesc(Long branchId);
}
