package com.restaurantmanagement.modules.customers.dto;
import jakarta.validation.constraints.NotBlank; import lombok.Data;
@Data public class CustomerRequest {
    @NotBlank private String fullName; private String email; private String phone; private String address;
    private String loyaltyTier; private Boolean active;
}
