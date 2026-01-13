package com.fsk.blogsitebackend.controller;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.CreateSocialMediaRequest;
import com.fsk.blogsitebackend.dto.SocialMediaResponse;
import com.fsk.blogsitebackend.service.SocialMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/social-media")
@RequiredArgsConstructor
public class SocialMediaController {

    private final SocialMediaService socialMediaService;

    @GetMapping
    public ResponseEntity<GenericResponse<List<SocialMediaResponse>>> getActiveSocialMedia() {
        List<SocialMediaResponse> data = socialMediaService.getActiveSocialMedia();
        return ResponseEntity.ok(GenericResponse.<List<SocialMediaResponse>>builder()
                .isSuccess(true)
                .message(SuccessMessages.SOCIAL_MEDIA_RETRIEVED)
                .data(data)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/admin")
    public ResponseEntity<GenericResponse<List<SocialMediaResponse>>> getAllSocialMedia() {
        List<SocialMediaResponse> data = socialMediaService.getAllSocialMedia();
        return ResponseEntity.ok(GenericResponse.<List<SocialMediaResponse>>builder()
                .isSuccess(true)
                .message(SuccessMessages.SOCIAL_MEDIA_RETRIEVED)
                .data(data)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping("/admin")
    public ResponseEntity<GenericResponse<SocialMediaResponse>> createSocialMedia(
            @RequestBody CreateSocialMediaRequest request) {
        SocialMediaResponse data = socialMediaService.createSocialMedia(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(GenericResponse.<SocialMediaResponse>builder()
                .isSuccess(true)
                .message(SuccessMessages.SOCIAL_MEDIA_CREATED)
                .data(data)
                .status(HttpStatus.CREATED)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<GenericResponse<SocialMediaResponse>> updateSocialMedia(
            @PathVariable UUID id,
            @RequestBody CreateSocialMediaRequest request) {
        SocialMediaResponse data = socialMediaService.updateSocialMedia(id, request);
        return ResponseEntity.ok(GenericResponse.<SocialMediaResponse>builder()
                .isSuccess(true)
                .message(SuccessMessages.SOCIAL_MEDIA_UPDATED)
                .data(data)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteSocialMedia(@PathVariable UUID id) {
        socialMediaService.deleteSocialMedia(id);
        return ResponseEntity.ok(GenericResponse.<Void>builder()
                .isSuccess(true)
                .message(SuccessMessages.SOCIAL_MEDIA_DELETED)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PatchMapping("/admin/{id}/toggle")
    public ResponseEntity<GenericResponse<Void>> toggleActiveStatus(@PathVariable UUID id) {
        socialMediaService.toggleActiveStatus(id);
        return ResponseEntity.ok(GenericResponse.<Void>builder()
                .isSuccess(true)
                .message(SuccessMessages.SOCIAL_MEDIA_UPDATED)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build());
    }
}
