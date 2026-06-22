package com.restaurantmanagement.modules.delivery.repository;

import com.restaurantmanagement.modules.delivery.entity.DeliveryOrder;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryOrderRepository extends JpaRepository<DeliveryOrder, Long> {
    Optional<DeliveryOrder> findByOrderId(Long orderId);
    List<DeliveryOrder> findByDriverId(Long driverId);
    List<DeliveryOrder> findByStatus(DeliveryStatus status);
}
