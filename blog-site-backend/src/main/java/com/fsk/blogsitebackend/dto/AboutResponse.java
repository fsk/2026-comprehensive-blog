package com.fsk.blogsitebackend.dto;

import java.util.List;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class AboutResponse {
    private List<EducationResponse> education;
    private List<ExperienceResponse> experience;
    private List<ReferenceResponse> references;
    private StatsResponse stats;

    @Data
    @Builder
    public static class EducationResponse {
        private String id;
        private String institution;
        private String degree;
        private String faculty;
        private String department;
        private String period;
        private String status;
        private String thesis;
        private String gpa;
    }

    @Data
    @Builder
    public static class ExperienceResponse {
        private String id;
        private String company;
        private String title;
        private String period;
        private Boolean isCurrent;
        private List<String> technologies;
        private String description;
        private String leaveReason;
    }

    @Data
    @Builder
    public static class ReferenceResponse {
        private String id;
        private String name;
        private String currentCompany;
        private String currentTitle;
        private String workedTogether;
        private String roleWhenWorked;
    }

    @Data
    @Builder
    public static class StatsResponse {
        private String yearsOfExperience;
        private Integer companyCount;
        private Integer technologyCount;
        private Integer referenceCount;
    }
}
