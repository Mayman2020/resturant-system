package com.restaurantmanagement.modules.users.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private Long branchId;
    private boolean active;
    private boolean mustChangePassword;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
}
