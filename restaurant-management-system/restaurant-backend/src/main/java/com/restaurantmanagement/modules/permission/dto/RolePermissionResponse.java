package com.restaurantmanagement.modules.permission.dto;

import com.restaurantmanagement.modules.users.entity.RoleType;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class RolePermissionResponse {
    private Long roleId;
    private RoleType role;
    private Map<String, Map<String, Boolean>> permissions;
}
