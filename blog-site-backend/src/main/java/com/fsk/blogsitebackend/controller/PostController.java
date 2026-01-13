package com.fsk.blogsitebackend.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.CreatePostRequest;
import com.fsk.blogsitebackend.dto.PostResponse;
import com.fsk.blogsitebackend.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<GenericResponse<PostResponse>> createPost(@RequestBody CreatePostRequest request) {
        PostResponse post = postService.createPost(request);
        GenericResponse<PostResponse> response = GenericResponse.<PostResponse>builder()
                .isSuccess(true)
                .message(SuccessMessages.POST_CREATED)
                .data(post)
                .status(HttpStatus.CREATED)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<GenericResponse<Page<PostResponse>>> getAllPosts(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String category,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String tag,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String search,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "10") int size) {
        Page<PostResponse> posts = postService.getFilteredPosts(category, tag, search, page, size);
        GenericResponse<Page<PostResponse>> response = GenericResponse.<Page<PostResponse>>builder()
                .isSuccess(true)
                .message(SuccessMessages.POSTS_RETRIEVED)
                .data(posts)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<GenericResponse<PostResponse>> getPostBySlug(@PathVariable String slug) {
        return postService.getPostBySlug(slug)
                .map(post -> {
                    GenericResponse<PostResponse> response = GenericResponse.<PostResponse>builder()
                            .isSuccess(true)
                            .message(SuccessMessages.POST_RETRIEVED)
                            .data(post)
                            .status(HttpStatus.OK)
                            .timestamp(LocalDateTime.now())
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    GenericResponse<PostResponse> response = GenericResponse.<PostResponse>builder()
                            .isSuccess(false)
                            .message("Post not found")
                            .error("No post found with slug: " + slug)
                            .status(HttpStatus.NOT_FOUND)
                            .timestamp(LocalDateTime.now())
                            .build();
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                });
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<PostResponse>> updatePost(
            @PathVariable UUID id,
            @RequestBody CreatePostRequest request) {
        PostResponse post = postService.updatePost(id, request);
        GenericResponse<PostResponse> response = GenericResponse.<PostResponse>builder()
                .isSuccess(true)
                .message(SuccessMessages.POST_UPDATED)
                .data(post)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
