package com.fsk.blogsitebackend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String role;
    private Boolean emailNotificationsEnabled;
    private Integer unreadNotificationCount;
}
