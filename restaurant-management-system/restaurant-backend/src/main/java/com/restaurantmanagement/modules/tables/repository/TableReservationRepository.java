package com.restaurantmanagement.modules.tables.repository;

import com.restaurantmanagement.modules.tables.entity.TableReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableReservationRepository extends JpaRepository<TableReservation, Long> {
    List<TableReservation> findByTableId(Long tableId);
}
