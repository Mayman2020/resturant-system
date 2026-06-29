package com.restaurantmanagement.modules.notifications.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String titleKey;
    private String bodyKey;
    private String varsJson;
    private boolean read;
    private LocalDateTime createdAt;
    private String referenceType;
    private Long referenceId;
}
