package com.fsk.blogsitebackend.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ErrorMessages;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.post.PostResponse;
import com.fsk.blogsitebackend.dto.post.postrequest.CreatePostRequest;
import com.fsk.blogsitebackend.service.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<GenericResponse<PostResponse>> createPost(@Valid @RequestBody CreatePostRequest request) {
        PostResponse post = postService.createPost(request);
        return ResponseUtil.successResponse(post, SuccessMessages.POST_CREATED, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<GenericResponse<Page<PostResponse>>> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostResponse> posts = postService.getFilteredPosts(category, tag, search, page, size);
        return ResponseUtil.successResponse(posts, SuccessMessages.POSTS_RETRIEVED, HttpStatus.OK);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<GenericResponse<PostResponse>> getPostBySlug(@PathVariable String slug) {
        return postService.findResponseBySlug(slug)
                .map(post -> ResponseUtil.successResponse(
                        post,
                        SuccessMessages.POST_RETRIEVED,
                        HttpStatus.OK))
                .orElseGet(() -> ResponseUtil.errorResponse(
                        ErrorMessages.POST_NOT_FOUND,
                        String.format(ErrorMessages.NO_POST_FOUND_WITH_SLUG, slug),
                        HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<PostResponse>> updatePost(@PathVariable UUID id, @Valid @RequestBody CreatePostRequest request) {
        PostResponse post = postService.updatePost(id, request);
        return ResponseUtil.successResponse(post, SuccessMessages.POST_UPDATED, HttpStatus.OK);
    }
}
