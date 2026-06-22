package com.restaurantmanagement.modules.delivery.entity;

import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_orders")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;
    @Column(name = "driver_id")
    private Long driverId;
    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;
    @Builder.Default @Column(name = "delivery_fee", precision = 10, scale = 2)
    private BigDecimal deliveryFee = BigDecimal.ZERO;
    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;
    @Enumerated(EnumType.STRING)
    @Builder.Default @Column(length = 20)
    private DeliveryStatus status = DeliveryStatus.PENDING;
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
