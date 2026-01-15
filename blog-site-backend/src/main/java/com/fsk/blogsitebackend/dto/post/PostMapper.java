package com.fsk.blogsitebackend.dto.post;

import com.fsk.blogsitebackend.dto.post.postrequest.CreatePostRequest;
import com.fsk.blogsitebackend.entities.PostEntity;
import com.fsk.blogsitebackend.entities.TagEntity;
import com.fsk.blogsitebackend.entities.User;

import java.time.LocalDateTime;
import java.util.Set;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "tags", ignore = true)
    PostEntity toEntity(CreatePostRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "tags", ignore = true)
    void updateFromRequest(CreatePostRequest request, @MappingTarget PostEntity post);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "tags", ignore = true)
    void updateFromEntity(PostEntity source, @MappingTarget PostEntity target);

    void updateAuthor(User author, @MappingTarget PostEntity post);


    void updatePublishedAt(LocalDateTime publishedAt, @MappingTarget PostEntity post);

    @Mapping(target = "deletedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "isActive", constant = "false")
    @Mapping(target = "status", expression = "java(com.fsk.blogsitebackend.entities.PostEntity.PostStatus.DELETED)")
    void applySoftDelete(PostEntity source, @MappingTarget PostEntity target);

    @Mapping(target = "tags", source = "tagNames")
    PostResponse toResponse(PostEntity post);
}
