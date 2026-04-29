package com.fsk.blogsitebackend.dto.booking;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentCheckoutResponse {
    private UUID bookingId;
    private String paymentReference;
    private String paymentUrl;
}
