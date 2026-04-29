package com.fsk.blogsitebackend.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AvailabilitySlotResponse {
    private UUID id;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private BigDecimal price;
    private String currency;
}
