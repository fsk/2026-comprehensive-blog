package com.fsk.blogsitebackend.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.fsk.blogsitebackend.dto.about.aboutrequest.AboutMeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.about.AboutResponse;
import com.fsk.blogsitebackend.dto.about.aboutrequest.EducationRequest;
import com.fsk.blogsitebackend.dto.about.aboutrequest.ExperienceRequest;
import com.fsk.blogsitebackend.dto.about.aboutrequest.ReferenceRequest;
import com.fsk.blogsitebackend.entities.Education;
import com.fsk.blogsitebackend.entities.Experience;
import com.fsk.blogsitebackend.entities.ReferenceJob;
import com.fsk.blogsitebackend.repository.EducationRepository;
import com.fsk.blogsitebackend.repository.ExperienceRepository;
import com.fsk.blogsitebackend.repository.ReferenceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AboutService {

    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final ReferenceRepository referenceRepository;
    private final AboutMeMapper aboutMeMapper;

    @Transactional(readOnly = true)
    public AboutResponse getAboutInfo() {
        List<Education> eduList = educationRepository.findAll();
        List<Experience> expList = experienceRepository.findAllByOrderByDisplayOrderAsc();
        List<ReferenceJob> refList = referenceRepository.findAll();

        return AboutResponse.builder()
                .education(eduList.stream().map(aboutMeMapper::toEducationResponse).collect(Collectors.toList()))
                .experience(expList.stream().map(aboutMeMapper::toExperienceResponse).collect(Collectors.toList()))
                .references(refList.stream().map(aboutMeMapper::toReferenceResponse).collect(Collectors.toList()))
                .stats(calculateStats(expList, refList))
                .build();
    }

    public UUID saveEducation(EducationRequest request) {
        Education education = aboutMeMapper.toEducationModel(request);
        return educationRepository.save(education).getId();
    }

    public void deleteEducation(UUID id) {
        educationRepository.deleteById(id);
    }

    public UUID saveExperience(ExperienceRequest request) {
        Experience experienceModel = aboutMeMapper.toExperienceModel(request);
        return experienceRepository.save(experienceModel).getId();
    }

    @Transactional
    public UUID updateExperience(UUID id, ExperienceRequest request) {
        Experience existing = experienceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        aboutMeMapper.updateExperienceFromRequest(request, existing);
        return experienceRepository.save(existing).getId();
    }

    public void deleteExperience(UUID id) {
        experienceRepository.deleteById(id);
    }

    public UUID saveReference(ReferenceRequest request) {
        ReferenceJob reference = aboutMeMapper.toReferenceModel(request);
        return referenceRepository.save(reference).getId();
    }

    @Transactional
    public UUID updateReference(UUID id, ReferenceRequest request) {
        ReferenceJob existing = referenceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reference", "id", id));
        aboutMeMapper.updateReferenceFromRequest(request, existing);
        return referenceRepository.save(existing).getId();
    }

    public void deleteReference(UUID id) {
        referenceRepository.deleteById(id);
    }

    private AboutResponse.StatsResponse calculateStats(List<Experience> experiences, List<ReferenceJob> references) {
        LocalDate startDate = LocalDate.of(2019, 11, 1);
        int years = Period.between(startDate, LocalDate.now()).getYears();

        Set<String> techCount = experiences.stream()
                .flatMap(e -> e.getTechnologies().stream())
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());


        return AboutResponse.StatsResponse.builder()
                .yearsOfExperience(years + "+")
                .companyCount(experiences.size())
                .technologyCount(techCount.size())
                .referenceCount(references.size())
                .build();
    }
}
