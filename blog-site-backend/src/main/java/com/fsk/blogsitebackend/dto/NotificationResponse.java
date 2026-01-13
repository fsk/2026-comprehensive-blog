package com.fsk.blogsitebackend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class NotificationResponse {
    private UUID id;
    private String type;
    private String message;
    private Boolean isRead;
    private String relatedPostSlug;
    private UUID relatedCommentId;
    private LocalDateTime createdAt;
}
