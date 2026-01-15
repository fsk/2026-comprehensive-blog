package com.fsk.blogsitebackend.controller;

import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.tag.TagResponse;
import com.fsk.blogsitebackend.dto.tag.tagrequest.CreateTagRequest;
import com.fsk.blogsitebackend.service.TagService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {
    
    private final TagService tagService;

    @GetMapping
    public ResponseEntity<GenericResponse<List<TagResponse>>> getAllTags() {
        List<TagResponse> tags = tagService.findAllResponses();
        return ResponseUtil.successResponse(tags, SuccessMessages.TAGS_RETRIEVED, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<GenericResponse<UUID>> createTag(@Valid @RequestBody CreateTagRequest request) {
        UUID savedTagId = tagService.create(request);
        return ResponseUtil.successResponse(savedTagId, SuccessMessages.TAG_CREATED, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<TagResponse>> updateTag(@PathVariable UUID id, @Valid @RequestBody CreateTagRequest request) {
        TagResponse updatedTag = tagService.updateResponse(id, request);
        return ResponseUtil.successResponse(updatedTag, SuccessMessages.TAG_UPDATED, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteTag(@PathVariable UUID id) {
        tagService.delete(id);
        return ResponseUtil.successResponse(null, SuccessMessages.TAG_DELETED, HttpStatus.OK);
    }
    
}
