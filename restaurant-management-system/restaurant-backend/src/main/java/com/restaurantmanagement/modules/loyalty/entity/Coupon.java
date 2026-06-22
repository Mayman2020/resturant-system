package com.restaurantmanagement.modules.loyalty.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Coupon {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    @Column(length = 255)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType;
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;
    @Builder.Default @Column(name = "min_order", precision = 10, scale = 2)
    private BigDecimal minOrder = BigDecimal.ZERO;
    @Column(name = "max_uses")
    private Integer maxUses;
    @Builder.Default @Column(name = "used_count")
    private Integer usedCount = 0;
    @Column(name = "valid_from")
    private LocalDateTime validFrom;
    @Column(name = "valid_until")
    private LocalDateTime validUntil;
    @Builder.Default @Column(name = "is_active")
    private boolean active = true;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
