package com.fsk.blogsitebackend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.dto.booking.PaymentCheckoutResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    @Value("${booking.payment.checkout-base-url:https://example-payment-gateway.local/pay}")
    private String checkoutBaseUrl;

    private final BookingService bookingService;

    public PaymentCheckoutResponse createCheckoutSession(UUID bookingId) {
        String paymentReference = "PAY-" + UUID.randomUUID();
        String paymentUrl = checkoutBaseUrl + "?bookingId=" + bookingId + "&reference=" + paymentReference;

        return PaymentCheckoutResponse.builder()
                .bookingId(bookingId)
                .paymentReference(paymentReference)
                .paymentUrl(paymentUrl)
                .build();
    }

    public void handlePaidWebhook(UUID bookingId, String paymentReference) {
        bookingService.markAsPaid(bookingId, paymentReference);
    }
}
