package com.fsk.blogsitebackend.dto;

import java.util.List;
import java.util.UUID;

import com.fsk.blogsitebackend.entities.PostEntity.PostStatus;

import lombok.Data;

@Data
public class CreatePostRequest {
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String featuredImage;
    private PostStatus status;
    private List<String> tags;
    private UUID authorId;
}
