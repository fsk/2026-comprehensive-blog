package com.fsk.blogsitebackend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class CommentResponse {
    private UUID id;
    private String content;
    private LocalDateTime createdAt;
    private AuthorResponse author;
    private UUID parentId;
    private List<CommentResponse> replies = new ArrayList<>();

    @Data
    public static class AuthorResponse {
        private UUID id;
        private String username;
        private String fullName;
        private String avatarUrl;
    }
}
