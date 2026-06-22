package com.restaurantmanagement.modules.billing.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "receipts")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Receipt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "order_id", nullable = false)
    private Long orderId;
    @Column(name = "receipt_number", nullable = false, unique = true, length = 50)
    private String receiptNumber;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;
    @Builder.Default @Column(name = "tax_amount", precision = 12, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    @Builder.Default @Column(name = "service_charge", precision = 12, scale = 2)
    private BigDecimal serviceCharge = BigDecimal.ZERO;
    @Builder.Default @Column(name = "tip_amount", precision = 12, scale = 2)
    private BigDecimal tipAmount = BigDecimal.ZERO;
    @Builder.Default @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    @Column(name = "printed_at")
    private LocalDateTime printedAt;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
