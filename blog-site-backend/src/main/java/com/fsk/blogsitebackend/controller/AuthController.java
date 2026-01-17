package com.fsk.blogsitebackend.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.user.AuthResponse;
import com.fsk.blogsitebackend.dto.user.UserResponse;
import com.fsk.blogsitebackend.dto.user.userrequest.LoginRequest;
import com.fsk.blogsitebackend.dto.user.userrequest.RegisterRequest;
import com.fsk.blogsitebackend.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        @PostMapping("/register")
        public ResponseEntity<GenericResponse<UserResponse>> register(@RequestBody RegisterRequest request) {
                UserResponse userResponse = authService.register(request);
                return ResponseUtil.successResponse(userResponse, SuccessMessages.AUTH_REGISTER_SUCCESS, HttpStatus.CREATED);
        }

        @GetMapping("/verify-email")
        public ResponseEntity<GenericResponse<Void>> verifyEmail(@RequestParam("token") String token) {
                authService.verifyEmail(token);
                return ResponseUtil.successResponse(null, SuccessMessages.EMAIL_VERIFIED, HttpStatus.OK);
        }

        @PostMapping("/login")
        public ResponseEntity<GenericResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
                AuthResponse authResponse = authService.login(request);
                return ResponseUtil.successResponse(authResponse, SuccessMessages.LOGIN_SUCCESS);
        }

        @GetMapping("/me")
        public ResponseEntity<GenericResponse<UserResponse>> getMe(Principal principal) {
                UserResponse user = authService.getCurrentUser(principal.getName());
                return ResponseUtil.successResponse(user, SuccessMessages.USER_DETAILS_RETRIEVED);
        }
}
