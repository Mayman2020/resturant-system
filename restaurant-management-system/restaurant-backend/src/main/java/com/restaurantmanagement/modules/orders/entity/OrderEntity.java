package com.restaurantmanagement.modules.orders.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "order_number", nullable = false, unique = true, length = 30)
    private String orderNumber;
    @Column(name = "branch_id", nullable = false)
    private Long branchId;
    @Column(name = "table_id")
    private Long tableId;
    @Column(name = "customer_id")
    private Long customerId;
    @Column(name = "waiter_id")
    private Long waiterId;
    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", nullable = false, length = 20)
    private OrderType orderType;
    @Enumerated(EnumType.STRING)
    @Builder.Default @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.PENDING;
    @Builder.Default @Column(precision = 12, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;
    @Builder.Default @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    @Builder.Default @Column(name = "tax_amount", precision = 12, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    @Builder.Default @Column(name = "service_charge", precision = 12, scale = 2)
    private BigDecimal serviceCharge = BigDecimal.ZERO;
    @Builder.Default @Column(name = "tip_amount", precision = 12, scale = 2)
    private BigDecimal tipAmount = BigDecimal.ZERO;
    @Builder.Default @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private String notes;
    @Builder.Default @Column(name = "is_held")
    private boolean held = false;
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
    @Column(name = "preparing_at")
    private LocalDateTime preparingAt;
    @Column(name = "ready_at")
    private LocalDateTime readyAt;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
}
