package com.restaurantmanagement.modules.loyalty.repository;

import com.restaurantmanagement.modules.loyalty.entity.LoyaltyPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, Long> {
    Optional<LoyaltyPoints> findByCustomerId(Long customerId);
}
