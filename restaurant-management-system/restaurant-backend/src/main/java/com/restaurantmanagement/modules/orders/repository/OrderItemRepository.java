package com.restaurantmanagement.modules.orders.repository;

import com.restaurantmanagement.modules.orders.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);

    @Query("SELECT oi.itemName, SUM(oi.quantity) FROM OrderItem oi JOIN oi.order o WHERE o.branchId = :branchId AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :from AND :to GROUP BY oi.itemName ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> topItems(@Param("branchId") Long branchId, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to, org.springframework.data.domain.Pageable pageable);
}
