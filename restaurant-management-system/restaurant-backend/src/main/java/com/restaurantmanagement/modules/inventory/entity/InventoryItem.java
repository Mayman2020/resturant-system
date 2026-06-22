package com.restaurantmanagement.modules.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "branch_id", nullable = false)
    private Long branchId;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(nullable = false, length = 30)
    private String unit;
    @Builder.Default @Column(name = "current_stock", precision = 12, scale = 3)
    private BigDecimal currentStock = BigDecimal.ZERO;
    @Builder.Default @Column(name = "min_stock", precision = 12, scale = 3)
    private BigDecimal minStock = BigDecimal.ZERO;
    @Builder.Default @Column(name = "cost_per_unit", precision = 10, scale = 2)
    private BigDecimal costPerUnit = BigDecimal.ZERO;
    @Builder.Default @Column(name = "is_active")
    private boolean active = true;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
