package com.restaurantmanagement.modules.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "menu_item_ingredients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItemIngredient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "menu_item_id", nullable = false)
    private Long menuItemId;
    @Column(name = "inventory_item_id", nullable = false)
    private Long inventoryItemId;
    @Column(name = "quantity_used", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantityUsed;
}
