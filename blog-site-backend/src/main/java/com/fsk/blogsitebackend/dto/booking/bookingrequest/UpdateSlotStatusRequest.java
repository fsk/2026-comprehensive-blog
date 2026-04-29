package com.fsk.blogsitebackend.dto.booking.bookingrequest;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSlotStatusRequest {

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
