package com.fsk.blogsitebackend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fsk.blogsitebackend.entities.PostEntity.PostStatus;

import lombok.Data;

@Data
public class PostResponse {
    private UUID id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String featuredImage;
    private PostStatus status;
    private LocalDateTime publishedAt;
    private Long viewCount;
    private AuthorResponse author;
    private List<String> tags;

    @Data
    public static class AuthorResponse {
        private UUID id;
        private String username;
        private String fullName;
        private String avatarUrl;
    }
}
