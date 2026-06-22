package com.restaurantmanagement.modules.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockMovement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "inventory_item_id", nullable = false)
    private Long inventoryItemId;
    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20)
    private MovementType movementType;
    @Column(nullable = false, precision = 12, scale = 3)
    private BigDecimal quantity;
    @Column(length = 100)
    private String reference;
    private String notes;
    @Column(name = "created_by")
    private Long createdBy;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
