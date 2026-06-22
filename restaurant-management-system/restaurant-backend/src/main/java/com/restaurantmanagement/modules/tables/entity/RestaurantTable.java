package com.restaurantmanagement.modules.tables.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_tables")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RestaurantTable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "branch_id", nullable = false)
    private Long branchId;
    @Column(name = "table_number", nullable = false, length = 20)
    private String tableNumber;
    @Enumerated(EnumType.STRING)
    @Column(name = "seating_type", nullable = false, length = 20)
    private SeatingType seatingType;
    @Builder.Default
    private Integer capacity = 4;
    @Enumerated(EnumType.STRING)
    @Builder.Default @Column(nullable = false, length = 20)
    private TableStatus status = TableStatus.AVAILABLE;
    @Column(name = "qr_code", length = 255)
    private String qrCode;
    @Builder.Default @Column(name = "is_active")
    private boolean active = true;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
