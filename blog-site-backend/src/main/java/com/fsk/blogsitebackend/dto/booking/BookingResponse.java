package com.fsk.blogsitebackend.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fsk.blogsitebackend.entities.Booking.BookingStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
    private UUID id;
    private UUID slotId;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String clientName;
    private String clientEmail;
    private String title;
    private String description;
    private BookingStatus status;
    private BigDecimal amount;
    private String currency;
    private String paymentReference;
    private LocalDateTime createdAt;
}
