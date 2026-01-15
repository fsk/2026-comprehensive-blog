package com.fsk.blogsitebackend.dto.socialmedia.socialmediarequests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSocialMediaRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Url is required")
    private String url;

    @NotBlank(message = "Icon name is required")
    private String iconName;

    @NotNull(message = "Display order is required")
    private Integer displayOrder;
}
