package com.fsk.blogsitebackend.service;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.socialmedia.SocialMediaMapper;
import com.fsk.blogsitebackend.dto.socialmedia.SocialMediaResponse;
import com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests.CreateSocialMediaRequest;
import com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests.UpdateSocialMediaRequest;
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
    private final SocialMediaMapper socialMediaMapper;

    @Transactional(readOnly = true)
    public List<SocialMediaResponse> getActiveSocialMedia() {
        return socialMediaRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(socialMediaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SocialMediaResponse> getAllSocialMedia() {
        return socialMediaRepository.findAll()
                .stream()
                .map(socialMediaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public SocialMediaResponse createSocialMedia(CreateSocialMediaRequest request) {
        SocialMedia socialMedia = socialMediaMapper.toEntity(request);
        return socialMediaMapper.toResponse(socialMediaRepository.save(socialMedia));
    }

    public SocialMediaResponse updateSocialMedia(UUID id, UpdateSocialMediaRequest request) {
        SocialMedia socialMedia = socialMediaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SocialMedia", "id", id));

        socialMediaMapper.updateFromRequest(request, socialMedia);
        return socialMediaMapper.toResponse(socialMediaRepository.save(socialMedia));
    }

    public void deleteSocialMedia(UUID id) {
        SocialMedia socialMedia = socialMediaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SocialMedia", "id", id));
        socialMediaRepository.delete(socialMedia);
    }

    public void toggleActiveStatus(UUID id) {
        SocialMedia socialMedia = socialMediaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SocialMedia", "id", id));
        socialMedia.setIsActive(!socialMedia.getIsActive());
        socialMediaRepository.save(socialMedia);
    }

}
