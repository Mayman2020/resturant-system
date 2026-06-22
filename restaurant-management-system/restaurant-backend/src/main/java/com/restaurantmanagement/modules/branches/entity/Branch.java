package com.restaurantmanagement.modules.branches.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "branches")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Branch {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    @Column(length = 500)
    private String address;
    @Column(length = 20)
    private String phone;
    @Column(length = 150)
    private String email;
    @Builder.Default @Column(length = 50)
    private String timezone = "UTC";
    @Builder.Default @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate = BigDecimal.ZERO;
    @Builder.Default @Column(name = "service_charge", precision = 5, scale = 2)
    private BigDecimal serviceCharge = BigDecimal.ZERO;
    @Builder.Default @Column(name = "is_active")
    private boolean active = true;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
