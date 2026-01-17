package com.fsk.blogsitebackend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.user.NotificationResponse;
import com.fsk.blogsitebackend.entities.Notification;
import com.fsk.blogsitebackend.entities.Notification.NotificationType;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.repository.NotificationRepository;
import com.fsk.blogsitebackend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void createNotification(User recipient, NotificationType type, String message,
            String relatedPostSlug, UUID relatedCommentId) {
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedPostSlug(relatedPostSlug);
        notification.setRelatedCommentId(relatedCommentId);
        notification.setIsRead(false);

        notificationRepository.save(notification);

        // Increment unread count
        recipient.setUnreadNotificationCount(recipient.getUnreadNotificationCount() + 1);
        userRepository.save(recipient);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Cannot mark someone else's notification as read");
        }

        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notificationRepository.save(notification);

            // Decrement unread count
            User user = notification.getUser();
            if (user.getUnreadNotificationCount() > 0) {
                user.setUnreadNotificationCount(user.getUnreadNotificationCount() - 1);
                userRepository.save(user);
            }
        }
    }

    public void markAllAsRead(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        notificationRepository.markAllAsReadByUserId(userId);
        user.setUnreadNotificationCount(0);
        userRepository.save(user);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType().name());
        response.setMessage(notification.getMessage());
        response.setIsRead(notification.getIsRead());
        response.setRelatedPostSlug(notification.getRelatedPostSlug());
        response.setRelatedCommentId(notification.getRelatedCommentId());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
