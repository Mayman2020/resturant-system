package com.restaurantmanagement.modules.orders.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "order_id", nullable = false)
    private Long orderId;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    @Column(length = 100)
    private String reference;
    @Builder.Default @Column(name = "paid_at")
    private LocalDateTime paidAt = LocalDateTime.now();
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
