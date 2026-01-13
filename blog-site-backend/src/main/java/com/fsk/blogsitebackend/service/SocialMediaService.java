package com.fsk.blogsitebackend.service;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.CreateSocialMediaRequest;
import com.fsk.blogsitebackend.dto.SocialMediaResponse;
import com.fsk.blogsitebackend.entities.SocialMedia;
import com.fsk.blogsitebackend.repository.SocialMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SocialMediaService {

    private final SocialMediaRepository socialMediaRepository;

    @Transactional(readOnly = true)
    public List<SocialMediaResponse> getActiveSocialMedia() {
        return socialMediaRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SocialMediaResponse> getAllSocialMedia() {
        return socialMediaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SocialMediaResponse createSocialMedia(CreateSocialMediaRequest request) {
        SocialMedia socialMedia = new SocialMedia();
        socialMedia.setName(request.getName());
        socialMedia.setUrl(request.getUrl());
        socialMedia.setIconName(request.getIconName());
        socialMedia.setDisplayOrder(request.getDisplayOrder());

        return mapToResponse(socialMediaRepository.save(socialMedia));
    }

    public SocialMediaResponse updateSocialMedia(UUID id, CreateSocialMediaRequest request) {
        SocialMedia socialMedia = socialMediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SocialMedia", "id", id));

        socialMedia.setName(request.getName());
        socialMedia.setUrl(request.getUrl());
        socialMedia.setIconName(request.getIconName());
        socialMedia.setDisplayOrder(request.getDisplayOrder());

        return mapToResponse(socialMediaRepository.save(socialMedia));
    }

    public void deleteSocialMedia(UUID id) {
        SocialMedia socialMedia = socialMediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SocialMedia", "id", id));
        socialMediaRepository.delete(socialMedia);
    }

    public void toggleActiveStatus(UUID id) {
        SocialMedia socialMedia = socialMediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SocialMedia", "id", id));
        socialMedia.setIsActive(!socialMedia.getIsActive());
        socialMediaRepository.save(socialMedia);
    }

    private SocialMediaResponse mapToResponse(SocialMedia socialMedia) {
        return SocialMediaResponse.builder()
                .id(socialMedia.getId())
                .name(socialMedia.getName())
                .url(socialMedia.getUrl())
                .iconName(socialMedia.getIconName())
                .displayOrder(socialMedia.getDisplayOrder())
                .isActive(socialMedia.getIsActive())
                .build();
    }
}
