package com.fsk.blogsitebackend.dto.socialmedia;

import com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests.CreateSocialMediaRequest;
import com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests.UpdateSocialMediaRequest;
import com.fsk.blogsitebackend.entities.SocialMedia;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SocialMediaMapper {

    SocialMedia toEntity(CreateSocialMediaRequest request);

    void updateFromRequest(UpdateSocialMediaRequest request, @MappingTarget SocialMedia socialMedia);

    SocialMediaResponse toResponse(SocialMedia socialMedia);
}
