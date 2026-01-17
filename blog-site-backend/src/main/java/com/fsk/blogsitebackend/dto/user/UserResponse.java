package com.fsk.blogsitebackend.dto.user;

import lombok.Data;

@Data
public class UserResponse {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String role;
    private Boolean emailNotificationsEnabled;
    private Integer unreadNotificationCount;
}
