package com.restaurantmanagement.modules.users.mapper;

import com.restaurantmanagement.modules.users.dto.UserResponse;
import com.restaurantmanagement.modules.users.entity.User;

public final class UserMapper {

    private UserMapper() {}

    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRoleType() != null ? user.getRoleType().name() : null)
                .branchId(user.getBranchId())
                .active(user.isActive())
                .mustChangePassword(user.isMustChangePassword())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
