package com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReorderSocialMediaRequest {

    @NotEmpty(message = "Order list cannot be empty")
    private List<UUID> idList;
}
