package com.restaurantmanagement.modules.users.dto;

import com.restaurantmanagement.modules.users.entity.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank
    private String username;
    @NotBlank
    @Email
    private String email;
    private String password;
    private String fullName;
    private String phone;
    @NotNull
    private RoleType role;
    private Long branchId;
    private Boolean active;
}
