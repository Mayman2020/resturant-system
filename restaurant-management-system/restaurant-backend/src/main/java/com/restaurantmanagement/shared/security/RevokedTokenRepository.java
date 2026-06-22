package com.restaurantmanagement.shared.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedTokenEntity, Long> {

    Optional<RevokedTokenEntity> findByTokenHash(String tokenHash);

    boolean existsByTokenHash(String tokenHash);

    @Modifying
    @Query("DELETE FROM RevokedTokenEntity r WHERE r.expiresAt <= :now")
    int deleteExpired(Instant now);
}
