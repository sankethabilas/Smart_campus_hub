package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.NotificationDto;
import com.project.smart_campus_operationhub.entities.Notification;
import com.project.smart_campus_operationhub.entities.Users;
import com.project.smart_campus_operationhub.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    /**
     * Creates and saves a new notification for the given user.
     *
     * @param recipient   the Users entity who should receive the notification
     * @param type        notification category (e.g. "TICKET", "ANNOUNCEMENT")
     * @param title       short heading of the notification
     * @param message     full body text
     * @param referenceType what the referenceId points to (e.g. "TICKET")
     * @param referenceId   ID of the related entity
     */
    @Transactional
    public void createNotification(Users recipient, String type, String title,
                                   String message, String referenceType, Integer referenceId) {
        Notification notification = Notification.builder()
                .users(recipient)
                .type(type)
                .title(title)
                .message(message)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .isRead(false)
                .build();
        notificationRepository.save(notification);

    }

    /**
     * Returns all notifications for a user, newest first.
     */
    @Transactional(readOnly = true)
    public List<NotificationDto> getMyNotifications(String email) {
        return notificationRepository.findByUsersEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns the count of unread notifications for a user.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        return notificationRepository.countByUsersEmailAndIsReadFalse(email);
    }

    /**
     * Marks a single notification as read. Throws if not found or not owned by the user.
     */
    @Transactional
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        if (!notification.getUsers().getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized: you do not own this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Marks all unread notifications for a user as read in a single batch save.
     */
    @Transactional
    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository
                .findByUsersEmailOrderByCreatedAtDesc(email)
                .stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    /**
     * Maps a Notification entity to a NotificationResponse DTO.
     */
    private NotificationDto mapToResponse(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceType(notification.getReferenceType())
                .referenceId(notification.getReferenceId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
