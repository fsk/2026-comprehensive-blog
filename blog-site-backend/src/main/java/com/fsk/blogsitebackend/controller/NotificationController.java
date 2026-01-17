package com.fsk.blogsitebackend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.dto.user.NotificationResponse;
import com.fsk.blogsitebackend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

        private final NotificationService notificationService;
        private final com.fsk.blogsitebackend.service.UserService userService;

        private UUID getUserId(java.security.Principal principal) {
                return userService.findByUsername(principal.getName())
                                .orElseThrow(() -> new com.fsk.blogsitebackend.common.exception.ResourceNotFoundException(
                                                "User", "username", principal.getName()))
                                .getId();
        }

        @GetMapping
        public ResponseEntity<GenericResponse<List<NotificationResponse>>> getNotifications(
                        java.security.Principal principal) {
                UUID userId = getUserId(principal);
                List<NotificationResponse> notifications = notificationService.getNotificationsForUser(userId);
                GenericResponse<List<NotificationResponse>> response = GenericResponse
                                .<List<NotificationResponse>>builder()
                                .isSuccess(true)
                                .message("Notifications retrieved successfully")
                                .data(notifications)
                                .status(HttpStatus.OK)
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(response);
        }

        @GetMapping("/count")
        public ResponseEntity<GenericResponse<Long>> getUnreadCount(java.security.Principal principal) {
                UUID userId = getUserId(principal);
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
                        java.security.Principal principal) {
                UUID userId = getUserId(principal);
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
        public ResponseEntity<GenericResponse<Void>> markAllAsRead(java.security.Principal principal) {
                UUID userId = getUserId(principal);
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
