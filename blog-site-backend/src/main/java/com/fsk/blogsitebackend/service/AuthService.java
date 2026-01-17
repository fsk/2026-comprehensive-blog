package com.fsk.blogsitebackend.service;

import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.user.AuthResponse;
import com.fsk.blogsitebackend.dto.user.UserResponse;
import com.fsk.blogsitebackend.dto.user.userrequest.LoginRequest;
import com.fsk.blogsitebackend.dto.user.userrequest.RegisterRequest;
import com.fsk.blogsitebackend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        UserResponse userResponse = userService.register(request);

        // Fetch entity to create token
        var user = userService.findByUsername(userResponse.getUsername()).orElseThrow(() -> new ResourceNotFoundException("User", "username", userResponse.getUsername()));

        String token = UUID.randomUUID().toString();
        userService.createVerificationToken(user, token);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), "http://localhost:5173/verify-email?token=" + token);

        return userResponse;
    }

    public void verifyEmail(String token) {
        userService.verifyEmail(token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        var user = userService.findByUsername(request.getUsername()).orElseThrow(() -> new ResourceNotFoundException("User", "username", request.getUsername()));

        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

    public UserResponse getCurrentUser(String username) {
        return userService.getUserByUsername(username);
    }

}
