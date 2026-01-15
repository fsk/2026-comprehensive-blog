package com.fsk.blogsitebackend.controller;

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
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.comment.CommentResponse;
import com.fsk.blogsitebackend.dto.comment.commentrequest.CreateCommentRequest;
import com.fsk.blogsitebackend.service.PostCommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts/{slug}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final PostCommentService commentService;

    @PostMapping
    public ResponseEntity<GenericResponse<CommentResponse>> createComment(
            @PathVariable String slug,
            @Valid @RequestBody CreateCommentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) UUID userId) {
        CommentResponse comment = commentService.createComment(slug, request, userId);
        return ResponseUtil.successResponse(comment, SuccessMessages.COMMENT_CREATED, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<GenericResponse<List<CommentResponse>>> getComments(@PathVariable String slug) {
        List<CommentResponse> comments = commentService.getCommentsForPost(slug);
        return ResponseUtil.successResponse(comments, SuccessMessages.COMMENTS_RETRIEVED, HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<GenericResponse<Void>> deleteComment(
            @PathVariable String slug,
            @PathVariable UUID commentId,
            @RequestHeader("X-User-Id") UUID userId) {
        commentService.softDeleteComment(commentId, userId);
        return ResponseUtil.successResponse(null, SuccessMessages.COMMENT_DELETED, HttpStatus.OK);
    }
}
