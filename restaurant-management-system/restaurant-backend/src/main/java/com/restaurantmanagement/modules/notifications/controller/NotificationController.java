package com.restaurantmanagement.modules.notifications.controller;

import com.restaurantmanagement.modules.notifications.dto.NotificationResponse;
import com.restaurantmanagement.modules.notifications.service.NotificationService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import com.restaurantmanagement.shared.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    @RequiresPermission(module = "dashboard", action = "view")
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>> list(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(notificationService.list(pageable))));
    }

    @GetMapping("/unread-count")
    @RequiresPermission(module = "dashboard", action = "view")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unreadCount() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("unreadCount", notificationService.unreadCount())));
    }

    @PatchMapping("/{id}/read")
    @RequiresPermission(module = "dashboard", action = "view")
    public ResponseEntity<ApiResponse<NotificationResponse>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.markRead(id)));
    }

    @PatchMapping("/read-all")
    @RequiresPermission(module = "dashboard", action = "view")
    public ResponseEntity<ApiResponse<Void>> markAllRead() {
        notificationService.markAllRead();
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
