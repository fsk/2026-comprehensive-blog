package com.fsk.blogsitebackend.dto.user;

import com.fsk.blogsitebackend.dto.user.userrequest.RegisterRequest;
import com.fsk.blogsitebackend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "unreadNotificationCount", constant = "0")
    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "locked", constant = "false")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "fullName", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "fullName", expression = "java(user.getFullName())")
    UserResponse toResponse(User user);
}
