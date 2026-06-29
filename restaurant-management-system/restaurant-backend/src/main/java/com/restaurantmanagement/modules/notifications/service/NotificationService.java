package com.restaurantmanagement.modules.notifications.service;

import com.restaurantmanagement.modules.notifications.dto.NotificationResponse;
import com.restaurantmanagement.modules.notifications.entity.Notification;
import com.restaurantmanagement.modules.notifications.repository.NotificationRepository;
import com.restaurantmanagement.modules.users.entity.User;
import com.restaurantmanagement.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Page<NotificationResponse> list(Pageable pageable) {
        return notificationRepository.findVisible(currentUserId(), pageable).map(this::toResponse);
    }

    public long unreadCount() {
        return notificationRepository.countUnread(currentUserId());
    }

    @Transactional
    public NotificationResponse markRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Notification not found"));
        Long userId = currentUserId();
        if (notification.getUserId() != null && !notification.getUserId().equals(userId)) {
            throw AppException.forbidden("Notification not accessible");
        }
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllRead() {
        notificationRepository.markAllRead(currentUserId());
    }

    private Long currentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user.getId();
        }
        return null;
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .titleKey(n.getTitleKey())
                .bodyKey(n.getBodyKey())
                .varsJson(n.getVarsJson())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .referenceType(n.getReferenceType())
                .referenceId(n.getReferenceId())
                .build();
    }
}
