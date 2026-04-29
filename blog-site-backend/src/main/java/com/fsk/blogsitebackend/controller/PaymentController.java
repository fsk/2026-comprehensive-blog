package com.fsk.blogsitebackend.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.dto.booking.PaymentCheckoutResponse;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.PaymentWebhookRequest;
import com.fsk.blogsitebackend.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/public/checkout/{bookingId}")
    public ResponseEntity<GenericResponse<PaymentCheckoutResponse>> createCheckout(@PathVariable UUID bookingId) {
        PaymentCheckoutResponse response = paymentService.createCheckoutSession(bookingId);
        return ResponseUtil.successResponse(response, "Checkout session created", HttpStatus.OK);
    }

    @PostMapping("/public/webhook/paid")
    public ResponseEntity<GenericResponse<Void>> paidWebhook(@Valid @RequestBody PaymentWebhookRequest request) {
        paymentService.handlePaidWebhook(request.getBookingId(), request.getPaymentReference());
        return ResponseUtil.successResponse(null, "Payment processed", HttpStatus.OK);
    }
}
