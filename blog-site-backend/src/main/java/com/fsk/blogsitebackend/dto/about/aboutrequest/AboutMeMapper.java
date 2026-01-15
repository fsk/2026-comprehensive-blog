package com.fsk.blogsitebackend.dto.about.aboutrequest;

import com.fsk.blogsitebackend.dto.about.AboutResponse;
import com.fsk.blogsitebackend.entities.Experience;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.fsk.blogsitebackend.entities.Education;
import com.fsk.blogsitebackend.entities.ReferenceJob;

@Mapper(componentModel = "spring")
public interface AboutMeMapper {

    Education toEducationModel(EducationRequest request);

    Experience toExperienceModel(ExperienceRequest request);

    void updateExperienceFromRequest(ExperienceRequest request, @MappingTarget Experience experience);

    ReferenceJob toReferenceModel(ReferenceRequest request);

    void updateReferenceFromRequest(ReferenceRequest request, @MappingTarget ReferenceJob reference);

    AboutResponse.EducationResponse toEducationResponse(Education education);

    AboutResponse.ExperienceResponse toExperienceResponse(Experience experience);

    AboutResponse.ReferenceResponse toReferenceResponse(ReferenceJob reference);

}
