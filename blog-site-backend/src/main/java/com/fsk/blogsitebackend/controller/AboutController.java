package com.fsk.blogsitebackend.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.dto.AboutResponse;
import com.fsk.blogsitebackend.entities.Education;
import com.fsk.blogsitebackend.entities.Experience;
import com.fsk.blogsitebackend.entities.ReferenceJob;
import com.fsk.blogsitebackend.service.AboutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/about")
@RequiredArgsConstructor
public class AboutController {

    private final AboutService aboutService;

    @GetMapping
    public ResponseEntity<GenericResponse<AboutResponse>> getAboutInfo() {
        AboutResponse aboutInfo = aboutService.getAboutInfo();
        GenericResponse<AboutResponse> response = GenericResponse.<AboutResponse>builder()
                .isSuccess(true)
                .message("About info retrieved successfully")
                .data(aboutInfo)
                .status(HttpStatus.OK)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    // Management endpoints
    @PostMapping("/education")
    public ResponseEntity<GenericResponse<Education>> addEducation(@RequestBody Education edu) {
        Education saved = aboutService.saveEducation(edu);
        return successResponse(saved, "Education added", HttpStatus.CREATED);
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteEducation(@PathVariable UUID id) {
        aboutService.deleteEducation(id);
        return successResponse(null, "Education deleted", HttpStatus.OK);
    }

    @PostMapping("/experience")
    public ResponseEntity<GenericResponse<Experience>> addExperience(@RequestBody Experience exp) {
        Experience saved = aboutService.saveExperience(exp);
        return successResponse(saved, "Experience added", HttpStatus.CREATED);
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<GenericResponse<Experience>> updateExperience(@PathVariable UUID id,
            @RequestBody Experience exp) {
        Experience updated = aboutService.updateExperience(id, exp);
        return successResponse(updated, "Experience updated", HttpStatus.OK);
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteExperience(@PathVariable UUID id) {
        aboutService.deleteExperience(id);
        return successResponse(null, "Experience deleted", HttpStatus.OK);
    }

    @PostMapping("/references")
    public ResponseEntity<GenericResponse<ReferenceJob>> addReference(@RequestBody ReferenceJob ref) {
        ReferenceJob saved = aboutService.saveReference(ref);
        return successResponse(saved, "Reference added", HttpStatus.CREATED);
    }

    @PutMapping("/references/{id}")
    public ResponseEntity<GenericResponse<ReferenceJob>> updateReference(@PathVariable UUID id,
            @RequestBody ReferenceJob ref) {
        ReferenceJob updated = aboutService.updateReference(id, ref);
        return successResponse(updated, "Reference updated", HttpStatus.OK);
    }

    @DeleteMapping("/references/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteReference(@PathVariable UUID id) {
        aboutService.deleteReference(id);
        return successResponse(null, "Reference deleted", HttpStatus.OK);
    }

    private <T> ResponseEntity<GenericResponse<T>> successResponse(T data, String message, HttpStatus status) {
        GenericResponse<T> response = GenericResponse.<T>builder()
                .isSuccess(true)
                .message(message)
                .data(data)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(response);
    }
}
