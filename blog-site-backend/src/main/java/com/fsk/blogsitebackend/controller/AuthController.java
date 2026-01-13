package com.fsk.blogsitebackend.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.RegisterRequest;
import com.fsk.blogsitebackend.dto.UserResponse;
import com.fsk.blogsitebackend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<GenericResponse<UserResponse>> register(@RequestBody RegisterRequest request) {
        UserResponse user = userService.register(request);
        GenericResponse<UserResponse> response = GenericResponse.<UserResponse>builder()
                .isSuccess(true)
                .message(SuccessMessages.USER_CREATED)
                .data(user)
                .status(HttpStatus.CREATED)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
