package com.fsk.blogsitebackend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private String content;
    private UUID parentId;
}
