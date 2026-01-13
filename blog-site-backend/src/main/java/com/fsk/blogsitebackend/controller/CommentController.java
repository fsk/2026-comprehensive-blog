package com.fsk.blogsitebackend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.CommentResponse;
import com.fsk.blogsitebackend.dto.CreateCommentRequest;
import com.fsk.blogsitebackend.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts/{slug}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<GenericResponse<CommentResponse>> createComment(
            @PathVariable String slug,
            @RequestBody CreateCommentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) UUID userId) {
        CommentResponse comment = commentService.createComment(slug, request, userId);
        GenericResponse<CommentResponse> response = GenericResponse.<CommentResponse>builder()
                .isSuccess(true)
                .message(SuccessMessages.COMMENT_CREATED)
                .data(comment)
                .status(HttpStatus.CREATED)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<GenericResponse<List<CommentResponse>>> getComments(@PathVariable String slug) {
        List<CommentResponse> comments = commentService.getCommentsForPost(slug);
        GenericResponse<List<CommentResponse>> response = GenericResponse.<List<CommentResponse>>builder()
                .isSuccess(true)
                .message(SuccessMessages.COMMENTS_RETRIEVED)
                .data(comments)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<GenericResponse<Void>> deleteComment(
            @PathVariable String slug,
            @PathVariable UUID commentId,
            @RequestHeader("X-User-Id") UUID userId) {
        commentService.softDeleteComment(commentId, userId);
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(true)
                .message(SuccessMessages.COMMENT_DELETED)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
