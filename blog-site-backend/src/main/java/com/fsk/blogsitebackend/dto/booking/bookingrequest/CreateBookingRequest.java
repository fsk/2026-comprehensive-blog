package com.fsk.blogsitebackend.dto.booking.bookingrequest;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateBookingRequest {

    @NotNull(message = "Slot id is required")
    private UUID slotId;

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must be at most 120 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 180, message = "Email must be at most 180 characters")
    private String email;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 120, message = "Title must be between 5 and 120 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
}
