package com.fsk.blogsitebackend.dto.booking.bookingrequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MarkBookingPaidRequest {

    @NotBlank(message = "Payment reference is required")
    @Size(max = 255, message = "Payment reference must be at most 255 characters")
    private String paymentReference;
}
