package com.fsk.blogsitebackend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.dto.NotificationResponse;
import com.fsk.blogsitebackend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<GenericResponse<List<NotificationResponse>>> getNotifications(
            @RequestHeader("X-User-Id") UUID userId) {
        List<NotificationResponse> notifications = notificationService.getNotificationsForUser(userId);
        GenericResponse<List<NotificationResponse>> response = GenericResponse.<List<NotificationResponse>>builder()
                .isSuccess(true)
                .message("Notifications retrieved successfully")
                .data(notifications)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<GenericResponse<Long>> getUnreadCount(
            @RequestHeader("X-User-Id") UUID userId) {
        long count = notificationService.getUnreadCount(userId);
        GenericResponse<Long> response = GenericResponse.<Long>builder()
                .isSuccess(true)
                .message("Unread count retrieved")
                .data(count)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<GenericResponse<Void>> markAsRead(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID userId) {
        notificationService.markAsRead(id, userId);
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(true)
                .message("Notification marked as read")
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/read-all")
    public ResponseEntity<GenericResponse<Void>> markAllAsRead(
            @RequestHeader("X-User-Id") UUID userId) {
        notificationService.markAllAsRead(userId);
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(true)
                .message("All notifications marked as read")
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
