package com.restaurantmanagement.modules.permission.service;

import com.restaurantmanagement.modules.permission.dto.RolePermissionResponse;
import com.restaurantmanagement.modules.permission.dto.RolePermissionUpdateRequest;
import com.restaurantmanagement.modules.permission.entity.RolePermission;
import com.restaurantmanagement.modules.permission.repository.RolePermissionRepository;
import com.restaurantmanagement.modules.users.entity.Role;
import com.restaurantmanagement.modules.users.entity.RoleType;
import com.restaurantmanagement.modules.users.repository.RoleRepository;
import com.restaurantmanagement.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;
    private final RoleRepository roleRepository;

    public List<RolePermissionResponse> getAll() {
        return roleRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public RolePermissionResponse getByRole(RoleType roleType) {
        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> AppException.notFound("Role not found: " + roleType));
        return toResponse(role);
    }

    public Map<String, Map<String, Boolean>> getPermissionMap(Long roleId) {
        List<RolePermission> rows = rolePermissionRepository.findByRoleId(roleId);
        Map<String, Map<String, Boolean>> result = new LinkedHashMap<>();
        for (RolePermission row : rows) {
            result.put(row.getModuleKey(), new LinkedHashMap<>(row.getPermissions()));
        }
        return result;
    }

    public Map<String, Map<String, Boolean>> getPermissionMap(RoleType roleType) {
        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> AppException.notFound("Role not found: " + roleType));
        return getPermissionMap(role.getId());
    }

    @Transactional
    public RolePermissionResponse update(RoleType roleType, RolePermissionUpdateRequest request) {
        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> AppException.notFound("Role not found: " + roleType));
        for (Map.Entry<String, Map<String, Boolean>> entry : request.getPermissions().entrySet()) {
            RolePermission entity = rolePermissionRepository
                    .findByRoleIdAndModuleKey(role.getId(), entry.getKey())
                    .orElseGet(() -> RolePermission.builder().role(role).moduleKey(entry.getKey()).build());
            entity.setPermissions(new LinkedHashMap<>(entry.getValue()));
            rolePermissionRepository.save(entity);
        }
        return toResponse(role);
    }

    private RolePermissionResponse toResponse(Role role) {
        return RolePermissionResponse.builder()
                .roleId(role.getId())
                .role(role.getName())
                .permissions(getPermissionMap(role.getId()))
                .build();
    }
}
