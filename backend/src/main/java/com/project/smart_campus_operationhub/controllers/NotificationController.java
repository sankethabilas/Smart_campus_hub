package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.ApiResponse;
import com.project.smart_campus_operationhub.dtos.NotificationDto;
import com.project.smart_campus_operationhub.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * GET /api/v1/notifications
     * Returns all notifications for the currently authenticated user.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotifications(
            @AuthenticationPrincipal String email) {
        log.info("Fetching notifications for user: {}", email);
        try {
            List<NotificationDto> notifications = notificationService.getMyNotifications(email);
            log.info("Found {} notifications for {}", notifications.size(), email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched successfully", notifications));
        } catch (Exception e) {
            log.error("Error fetching notifications for {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }

    }

    /**
     * GET /api/v1/notifications/unread-count
     * Returns the count of unread notifications for the authenticated user.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal String email) {
        log.info("Fetching unread count for user: {}", email);
        try {
            long count = notificationService.getUnreadCount(email);
            log.info("Unread count for {}: {}", email, count);
            return ResponseEntity.ok(new ApiResponse<>(true, "Unread count fetched", count));
        } catch (Exception e) {
            log.error("Error fetching unread count for {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * PUT /api/v1/notifications/{id}/read
     * Marks a specific notification as read.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        try {
            notificationService.markAsRead(id, email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Notification marked as read", null));
        } catch (Exception e) {
            log.error("Error marking notification {} as read: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * PUT /api/v1/notifications/read-all
     * Marks all notifications for the authenticated user as read.
     */
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal String email) {
        try {
            notificationService.markAllAsRead(email);
            return ResponseEntity.ok(new ApiResponse<>(true, "All notifications marked as read", null));
        } catch (Exception e) {
            log.error("Error marking all notifications as read for {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
