package com.restaurantmanagement.modules.menu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "menu_categories")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuCategory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "branch_id")
    private Long branchId;
    @Column(nullable = false, length = 100)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(name = "category_type", nullable = false, length = 30)
    private CategoryType categoryType;
    @Builder.Default @Column(name = "sort_order")
    private Integer sortOrder = 0;
    @Builder.Default @Column(name = "is_active")
    private boolean active = true;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
