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
public class EducationRequest {

    @NotBlank(message = "Institution is required")
    private String institution;

    @NotBlank(message = "Degree is required")
    private String degree;

    private String faculty;

    private String department;

    @NotBlank(message = "Period is required")
    private String period;

    private String status;

    private String thesis;

    private String gpa;
}
