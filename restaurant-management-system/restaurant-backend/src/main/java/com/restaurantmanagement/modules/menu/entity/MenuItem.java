package com.restaurantmanagement.modules.menu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "category_id", nullable = false)
    private Long categoryId;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    @Builder.Default @Column(name = "preparation_time")
    private Integer preparationTime = 15;
    @Builder.Default @Column(name = "is_available")
    private boolean available = true;
    @Builder.Default @Column(name = "is_active")
    private boolean active = true;
    @CreatedDate @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
