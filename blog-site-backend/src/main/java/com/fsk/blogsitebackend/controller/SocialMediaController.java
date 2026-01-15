package com.fsk.blogsitebackend.controller;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests.CreateSocialMediaRequest;
import com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests.UpdateSocialMediaRequest;
import com.fsk.blogsitebackend.dto.socialmedia.SocialMediaResponse;
import com.fsk.blogsitebackend.service.SocialMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/social-media")
@RequiredArgsConstructor
public class SocialMediaController {

    private final SocialMediaService socialMediaService;

    @GetMapping
    public ResponseEntity<GenericResponse<List<SocialMediaResponse>>> getActiveSocialMedia() {
        List<SocialMediaResponse> data = socialMediaService.getActiveSocialMedia();
        return ResponseUtil.successResponse(data, SuccessMessages.SOCIAL_MEDIA_RETRIEVED, HttpStatus.OK);
    }

    @GetMapping("/admin")
    public ResponseEntity<GenericResponse<List<SocialMediaResponse>>> getAllSocialMedia() {
        List<SocialMediaResponse> data = socialMediaService.getAllSocialMedia();
        return ResponseUtil.successResponse(data, SuccessMessages.SOCIAL_MEDIA_RETRIEVED, HttpStatus.OK);
    }

    @PostMapping("/admin")
    public ResponseEntity<GenericResponse<SocialMediaResponse>> createSocialMedia(
            @Valid @RequestBody CreateSocialMediaRequest request) {
        SocialMediaResponse data = socialMediaService.createSocialMedia(request);
        return ResponseUtil.successResponse(data, SuccessMessages.SOCIAL_MEDIA_CREATED, HttpStatus.CREATED);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<GenericResponse<SocialMediaResponse>> updateSocialMedia(@PathVariable UUID id,
            @Valid @RequestBody UpdateSocialMediaRequest request) {
        SocialMediaResponse data = socialMediaService.updateSocialMedia(id, request);
        return ResponseUtil.successResponse(data, SuccessMessages.SOCIAL_MEDIA_UPDATED, HttpStatus.OK);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteSocialMedia(@PathVariable UUID id) {
        socialMediaService.deleteSocialMedia(id);
        return ResponseUtil.successResponse(null, SuccessMessages.SOCIAL_MEDIA_DELETED, HttpStatus.OK);
    }

    @PatchMapping("/admin/{id}/toggle")
    public ResponseEntity<GenericResponse<Void>> toggleActiveStatus(@PathVariable UUID id) {
        socialMediaService.toggleActiveStatus(id);
        return ResponseUtil.successResponse(null, SuccessMessages.SOCIAL_MEDIA_UPDATED, HttpStatus.OK);
    }
}
