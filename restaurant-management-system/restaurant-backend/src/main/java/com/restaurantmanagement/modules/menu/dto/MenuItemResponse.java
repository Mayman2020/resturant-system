package com.restaurantmanagement.modules.menu.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class MenuItemResponse {
    private Long id; private Long categoryId; private String name; private String description;
    private String imageUrl; private BigDecimal price; private Integer preparationTime;
    private boolean available; private boolean active;
}
