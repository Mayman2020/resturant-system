package com.restaurantmanagement.modules.notifications.repository;

import com.restaurantmanagement.modules.notifications.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE n.userId IS NULL OR n.userId = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findVisible(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.userId IS NULL OR n.userId = :userId) AND n.read = false")
    long countUnread(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE (n.userId IS NULL OR n.userId = :userId) AND n.read = false")
    int markAllRead(@Param("userId") Long userId);
}
