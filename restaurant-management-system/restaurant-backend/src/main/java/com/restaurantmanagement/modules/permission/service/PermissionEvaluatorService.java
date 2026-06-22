package com.restaurantmanagement.modules.permission.service;

import com.restaurantmanagement.modules.users.entity.RoleType;
import com.restaurantmanagement.modules.users.entity.User;
import com.restaurantmanagement.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PermissionEvaluatorService {

    private final RolePermissionService rolePermissionService;

    public void assertCan(String module, String action) {
        User user = resolveCurrentUser();
        if (user.getRoleType() == RoleType.ADMIN) {
            return;
        }
        Map<String, Map<String, Boolean>> permissions = rolePermissionService.getPermissionMap(user.getRole().getId());
        Map<String, Boolean> modulePerms = permissions.get(module);
        if (modulePerms == null || !Boolean.TRUE.equals(modulePerms.get(action))) {
            throw AppException.forbidden("Access denied: action '" + action + "' on module '" + module + "' is not allowed");
        }
    }

    public boolean can(String module, String action) {
        try {
            assertCan(module, action);
            return true;
        } catch (AppException e) {
            return false;
        }
    }

    private User resolveCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            throw AppException.forbidden("Authentication required");
        }
        return user;
    }
}
