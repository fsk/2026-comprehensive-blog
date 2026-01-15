package com.fsk.blogsitebackend.dto.comment.commentrequest;

import java.util.UUID;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private String content;
    private UUID parentId;
}
