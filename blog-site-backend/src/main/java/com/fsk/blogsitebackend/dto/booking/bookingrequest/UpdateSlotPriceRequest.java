package com.fsk.blogsitebackend.dto.booking.bookingrequest;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSlotPriceRequest {

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    private String currency = "TRY";
}
