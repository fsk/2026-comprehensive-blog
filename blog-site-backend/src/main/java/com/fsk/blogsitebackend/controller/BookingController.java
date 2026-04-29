package com.fsk.blogsitebackend.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.dto.booking.BookingResponse;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.CreateBookingRequest;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.MarkBookingPaidRequest;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.service.BookingService;
import com.fsk.blogsitebackend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @PostMapping("/public")
    public ResponseEntity<GenericResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseUtil.successResponse(response, "Booking created. Payment is pending.", HttpStatus.CREATED);
    }

    @GetMapping("/admin")
    public ResponseEntity<GenericResponse<List<BookingResponse>>> getAllBookings(java.security.Principal principal) {
        requireAdmin(principal);
        List<BookingResponse> responses = bookingService.getAllBookings();
        return ResponseUtil.successResponse(responses, "Bookings retrieved", HttpStatus.OK);
    }

    @PatchMapping("/admin/{bookingId}/mark-paid")
    public ResponseEntity<GenericResponse<BookingResponse>> markBookingAsPaid(
            @PathVariable UUID bookingId,
            @Valid @RequestBody MarkBookingPaidRequest request,
            java.security.Principal principal) {
        requireAdmin(principal);
        BookingResponse response = bookingService.markAsPaid(bookingId, request.getPaymentReference());
        return ResponseUtil.successResponse(response, "Booking marked as paid", HttpStatus.OK);
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
