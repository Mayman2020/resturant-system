package com.restaurantmanagement.modules.users.repository;

import com.restaurantmanagement.modules.users.entity.Role;
import com.restaurantmanagement.modules.users.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleType name);
}
