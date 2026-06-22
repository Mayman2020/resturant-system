package com.restaurantmanagement.modules.permission.repository;

import com.restaurantmanagement.modules.permission.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    List<RolePermission> findByRoleId(Long roleId);

    Optional<RolePermission> findByRoleIdAndModuleKey(Long roleId, String moduleKey);
}
