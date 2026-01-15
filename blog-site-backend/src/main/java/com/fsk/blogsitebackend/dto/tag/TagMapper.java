package com.fsk.blogsitebackend.dto.tag;

import com.fsk.blogsitebackend.dto.tag.tagrequest.CreateTagRequest;
import com.fsk.blogsitebackend.entities.TagEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TagMapper {

    TagEntity toEntity(CreateTagRequest request);

    void updateTagFromRequest(CreateTagRequest request, @MappingTarget TagEntity tag);

    TagResponse toResponse(TagEntity tag);

    @Mapping(target = "deletedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "isActive", constant = "false")
    TagEntity applySoftDelete(TagEntity tag);
}
