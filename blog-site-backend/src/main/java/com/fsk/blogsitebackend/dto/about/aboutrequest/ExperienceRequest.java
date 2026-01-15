package com.fsk.blogsitebackend.dto.about.aboutrequest;

import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceRequest {

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Period is required")
    private String period;

    @NotNull(message = "Is current is required")
    private Boolean isCurrent;

    @NotEmpty(message = "Technologies are required")
    @Size(min = 1, message = "At least one technology is required")
    private List<String> technologies;

    @NotBlank(message = "Description is required")
    private String description;

    @Nullable
    private String leaveReason;

    private Integer displayOrder;
}
