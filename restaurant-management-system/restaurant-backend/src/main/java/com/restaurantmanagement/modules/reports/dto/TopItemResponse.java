package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class TopItemResponse { private String itemName; private Long quantitySold; }
