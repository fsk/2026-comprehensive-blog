package com.fsk.blogsitebackend.dto.about.aboutrequest;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferenceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Current company is required")
    private String currentCompany;

    @NotBlank(message = "Current title is required")
    private String currentTitle;

    @NotBlank(message = "Worked together is required")
    private String workedTogether;

    @NotBlank(message = "Role when worked is required")
    private String roleWhenWorked;
}
