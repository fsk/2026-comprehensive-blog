package com.fsk.blogsitebackend.dto.comment;

import com.fsk.blogsitebackend.entities.PostComment;
import com.fsk.blogsitebackend.entities.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "parentId", source = "parentComment.id")
    @Mapping(target = "replies", ignore = true)
    CommentResponse toResponse(PostComment comment);

    CommentResponse.AuthorResponse toAuthorResponse(User user);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "deletedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "isActive", constant = "false")
    void applySoftDelete(PostComment source, @MappingTarget PostComment target);
}
