package com.restaurantmanagement.modules.customers.mapper;
import com.restaurantmanagement.modules.customers.dto.CustomerResponse;
import com.restaurantmanagement.modules.customers.entity.Customer;
public final class CustomerMapper {
    private CustomerMapper() {}
    public static CustomerResponse toResponse(Customer c) {
        return CustomerResponse.builder().id(c.getId()).fullName(c.getFullName()).email(c.getEmail())
                .phone(c.getPhone()).address(c.getAddress()).loyaltyTier(c.getLoyaltyTier()).active(c.isActive()).build();
    }
}
