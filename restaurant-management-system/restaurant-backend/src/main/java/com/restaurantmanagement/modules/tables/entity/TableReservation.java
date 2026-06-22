package com.restaurantmanagement.modules.tables.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "table_reservations")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TableReservation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "table_id", nullable = false)
    private Long tableId;
    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;
    @Column(name = "customer_phone", length = 20)
    private String customerPhone;
    @Column(name = "party_size", nullable = false)
    private Integer partySize;
    @Column(name = "reserved_at", nullable = false)
    private LocalDateTime reservedAt;
    @Builder.Default @Column(length = 20)
    private String status = "CONFIRMED";
    private String notes;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
