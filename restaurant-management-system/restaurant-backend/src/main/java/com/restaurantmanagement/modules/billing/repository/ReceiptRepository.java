package com.restaurantmanagement.modules.billing.repository;

import com.restaurantmanagement.modules.billing.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    List<Receipt> findByOrderId(Long orderId);
}
