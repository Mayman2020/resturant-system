package com.restaurantmanagement.modules.customers.repository;

import com.restaurantmanagement.modules.customers.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT c FROM Customer c WHERE :q IS NULL OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%')) OR c.phone LIKE CONCAT('%', :q, '%')")
    Page<Customer> search(@Param("q") String q, Pageable pageable);
}
