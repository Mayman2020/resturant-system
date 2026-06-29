package com.restaurantmanagement.modules.users.repository;

import com.restaurantmanagement.modules.users.entity.RoleType;
import com.restaurantmanagement.modules.users.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByEmailIgnoreCase(String email);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:identifier) OR LOWER(u.email) = LOWER(:identifier)")
    Optional<User> findByUsernameOrEmail(@Param("identifier") String identifier);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    @Query("SELECT u FROM User u JOIN u.role r WHERE (LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%'))) AND (:roleType IS NULL OR r.name = :roleType)")
    Page<User> searchFiltered(@Param("q") String q, @Param("roleType") RoleType roleType, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.role r WHERE (:roleType IS NULL OR r.name = :roleType)")
    Page<User> findByRole(@Param("roleType") RoleType roleType, Pageable pageable);

    long countByBranchIdAndActiveTrue(Long branchId);

    long countByRoleNameAndActiveTrue(RoleType roleType);
}
