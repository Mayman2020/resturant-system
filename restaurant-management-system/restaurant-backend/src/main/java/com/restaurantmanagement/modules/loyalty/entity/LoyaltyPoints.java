package com.restaurantmanagement.modules.loyalty.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_points")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoyaltyPoints {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "customer_id", nullable = false, unique = true)
    private Long customerId;
    @Builder.Default
    private Integer points = 0;
    @Builder.Default @Column(length = 30)
    private String tier = "STANDARD";
    @Builder.Default @Column(name = "lifetime_points")
    private Integer lifetimePoints = 0;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
