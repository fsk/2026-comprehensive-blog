package com.fsk.blogsitebackend.dto.booking.bookingrequest;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentWebhookRequest {

    @NotNull(message = "Booking id is required")
    private UUID bookingId;

    @NotBlank(message = "Payment reference is required")
    private String paymentReference;
}
