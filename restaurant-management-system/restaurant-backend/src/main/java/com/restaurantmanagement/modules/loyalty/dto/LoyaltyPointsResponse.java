package com.restaurantmanagement.modules.loyalty.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class LoyaltyPointsResponse {
    private Long id; private Long customerId; private Integer points; private String tier; private Integer lifetimePoints;
}
