package com.fsk.blogsitebackend.controller;

import java.util.UUID;

import com.fsk.blogsitebackend.dto.about.aboutrequest.ExperienceRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.about.AboutResponse;
import com.fsk.blogsitebackend.dto.about.aboutrequest.EducationRequest;
import com.fsk.blogsitebackend.dto.about.aboutrequest.ReferenceRequest;
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
        return ResponseUtil.successResponse(aboutInfo, SuccessMessages.ABOUT_INFO_RETRIEVED, HttpStatus.OK);
    }

    @PostMapping("/education")
    public ResponseEntity<GenericResponse<UUID>> addEducation(@Valid @RequestBody EducationRequest request) {
        UUID uuid = aboutService.saveEducation(request);
        return ResponseUtil.successResponse(uuid, SuccessMessages.EDUCATION_ADDED, HttpStatus.CREATED);
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteEducation(@PathVariable UUID id) {
        aboutService.deleteEducation(id);
        return ResponseUtil.successResponse(null, SuccessMessages.EDUCATION_DELETED, HttpStatus.OK);
    }

    @PostMapping("/experience")
    public ResponseEntity<GenericResponse<UUID>> addExperience(@Valid @RequestBody ExperienceRequest request) {
        UUID savedExperienceId = aboutService.saveExperience(request);
        return ResponseUtil.successResponse(savedExperienceId, SuccessMessages.EXPERIENCE_ADDED, HttpStatus.CREATED);
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<GenericResponse<UUID>> updateExperience(@PathVariable UUID id, @Valid @RequestBody ExperienceRequest request) {
        UUID updateExperienceId = aboutService.updateExperience(id, request);
        return ResponseUtil.successResponse(updateExperienceId, SuccessMessages.EXPERIENCE_UPDATED, HttpStatus.OK);
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteExperience(@PathVariable UUID id) {
        aboutService.deleteExperience(id);
        return ResponseUtil.successResponse(null, SuccessMessages.EXPERIENCE_DELETED, HttpStatus.OK);
    }

    @PostMapping("/references")
    public ResponseEntity<GenericResponse<UUID>> addReference(@Valid @RequestBody ReferenceRequest request) {
        UUID savedReferenceId = aboutService.saveReference(request);
        return ResponseUtil.successResponse(savedReferenceId, SuccessMessages.REFERENCE_ADDED, HttpStatus.CREATED);
    }

    @PutMapping("/references/{id}")
    public ResponseEntity<GenericResponse<UUID>> updateReference(@PathVariable UUID id,
            @Valid @RequestBody ReferenceRequest request) {
        UUID updatedReferenceId = aboutService.updateReference(id, request);
        return ResponseUtil.successResponse(updatedReferenceId, SuccessMessages.REFERENCE_UPDATED, HttpStatus.OK);
    }

    @DeleteMapping("/references/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteReference(@PathVariable UUID id) {
        aboutService.deleteReference(id);
        return ResponseUtil.successResponse(null, SuccessMessages.REFERENCE_DELETED, HttpStatus.OK);
    }
}
