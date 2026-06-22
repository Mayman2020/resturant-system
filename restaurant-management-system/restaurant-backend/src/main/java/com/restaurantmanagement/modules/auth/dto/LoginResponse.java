package com.restaurantmanagement.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private UserDto user;

    @Data
    @Builder
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private Long branchId;
        private boolean mustChangePassword;
        private Map<String, Map<String, Boolean>> permissions;
    }
}
