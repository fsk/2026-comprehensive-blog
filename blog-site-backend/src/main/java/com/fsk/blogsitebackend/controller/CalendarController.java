package com.fsk.blogsitebackend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.dto.booking.AvailabilitySlotResponse;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.GenerateAvailabilityRequest;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.UpdateSlotPriceRequest;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.UpdateSlotStatusRequest;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.service.AvailabilityService;
import com.fsk.blogsitebackend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final AvailabilityService availabilityService;
    private final UserService userService;

    @PostMapping("/admin/generate")
    public ResponseEntity<GenericResponse<Integer>> generateSlots(
            @Valid @RequestBody GenerateAvailabilityRequest request,
            java.security.Principal principal) {
        requireAdmin(principal);
        int createdCount = availabilityService.generateSlots(request);
        return ResponseUtil.successResponse(createdCount, "Availability slots generated", HttpStatus.CREATED);
    }

    @GetMapping("/public/availability")
    public ResponseEntity<GenericResponse<List<AvailabilitySlotResponse>>> getPublicAvailability(
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {
        List<AvailabilitySlotResponse> slots = availabilityService.getPublicAvailability(from, to);
        return ResponseUtil.successResponse(slots, "Availability slots retrieved", HttpStatus.OK);
    }

    @PatchMapping("/admin/slots/{slotId}/price")
    public ResponseEntity<GenericResponse<AvailabilitySlotResponse>> updateSlotPrice(
            @PathVariable UUID slotId,
            @Valid @RequestBody UpdateSlotPriceRequest request,
            java.security.Principal principal) {
        requireAdmin(principal);
        AvailabilitySlotResponse response = availabilityService.updatePrice(slotId, request);
        return ResponseUtil.successResponse(response, "Slot price updated", HttpStatus.OK);
    }

    @PatchMapping("/admin/slots/{slotId}/status")
    public ResponseEntity<GenericResponse<AvailabilitySlotResponse>> updateSlotStatus(
            @PathVariable UUID slotId,
            @Valid @RequestBody UpdateSlotStatusRequest request,
            java.security.Principal principal) {
        requireAdmin(principal);
        AvailabilitySlotResponse response = availabilityService.updateStatus(slotId, request);
        return ResponseUtil.successResponse(response, "Slot status updated", HttpStatus.OK);
    }

    private void requireAdmin(java.security.Principal principal) {
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new com.fsk.blogsitebackend.common.exception.ResourceNotFoundException(
                        "User", "username", principal.getName()));

        if (user.getRole() != User.UserRole.ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Only admins can access this endpoint");
        }
    }
}
