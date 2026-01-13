package com.fsk.blogsitebackend.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.AboutResponse;
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

    @Transactional(readOnly = true)
    public AboutResponse getAboutInfo() {
        List<Education> eduList = educationRepository.findAll();
        List<Experience> expList = experienceRepository.findAllByOrderByDisplayOrderAsc();
        List<ReferenceJob> refList = referenceRepository.findAll();

        return AboutResponse.builder()
                .education(eduList.stream().map(this::mapEducation).collect(Collectors.toList()))
                .experience(expList.stream().map(this::mapExperience).collect(Collectors.toList()))
                .references(refList.stream().map(this::mapReference).collect(Collectors.toList()))
                .stats(calculateStats(expList, refList))
                .build();
    }

    // CRUD for Education
    public Education saveEducation(Education education) {
        return educationRepository.save(education);
    }

    public void deleteEducation(UUID id) {
        educationRepository.deleteById(id);
    }

    // CRUD for Experience
    public Experience saveExperience(Experience experience) {
        return experienceRepository.save(experience);
    }

    public Experience updateExperience(UUID id, Experience details) {
        Experience existing = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));

        existing.setCompany(details.getCompany());
        existing.setTitle(details.getTitle());
        existing.setPeriod(details.getPeriod());
        existing.setIsCurrent(details.getIsCurrent());
        existing.setTechnologies(details.getTechnologies());
        existing.setDescription(details.getDescription());
        existing.setLeaveReason(details.getLeaveReason());
        existing.setDisplayOrder(details.getDisplayOrder());

        return experienceRepository.save(existing);
    }

    public void deleteExperience(UUID id) {
        experienceRepository.deleteById(id);
    }

    // CRUD for Reference
    public ReferenceJob saveReference(ReferenceJob reference) {
        return referenceRepository.save(reference);
    }

    public ReferenceJob updateReference(UUID id, ReferenceJob details) {
        ReferenceJob existing = referenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reference", "id", id));

        existing.setName(details.getName());
        existing.setCurrentCompany(details.getCurrentCompany());
        existing.setCurrentTitle(details.getCurrentTitle());
        existing.setWorkedTogether(details.getWorkedTogether());
        existing.setRoleWhenWorked(details.getRoleWhenWorked());

        return referenceRepository.save(existing);
    }

    public void deleteReference(UUID id) {
        referenceRepository.deleteById(id);
    }

    private AboutResponse.EducationResponse mapEducation(Education edu) {
        return AboutResponse.EducationResponse.builder()
                .id(edu.getId().toString())
                .institution(edu.getInstitution())
                .degree(edu.getDegree())
                .faculty(edu.getFaculty())
                .department(edu.getDepartment())
                .period(edu.getPeriod())
                .status(edu.getStatus())
                .thesis(edu.getThesis())
                .gpa(edu.getGpa())
                .build();
    }

    private AboutResponse.ExperienceResponse mapExperience(Experience exp) {
        return AboutResponse.ExperienceResponse.builder()
                .id(exp.getId().toString())
                .company(exp.getCompany())
                .title(exp.getTitle())
                .period(exp.getPeriod())
                .isCurrent(exp.getIsCurrent())
                .technologies(exp.getTechnologies())
                .description(exp.getDescription())
                .leaveReason(exp.getLeaveReason())
                .build();
    }

    private AboutResponse.ReferenceResponse mapReference(ReferenceJob ref) {
        return AboutResponse.ReferenceResponse.builder()
                .id(ref.getId().toString())
                .name(ref.getName())
                .currentCompany(ref.getCurrentCompany())
                .currentTitle(ref.getCurrentTitle())
                .workedTogether(ref.getWorkedTogether())
                .roleWhenWorked(ref.getRoleWhenWorked())
                .build();
    }

    private AboutResponse.StatsResponse calculateStats(List<Experience> experiences, List<ReferenceJob> references) {
        LocalDate startDate = LocalDate.of(2019, 11, 1);
        int years = Period.between(startDate, LocalDate.now()).getYears();

        long techCount = experiences.stream()
                .flatMap(e -> e.getTechnologies().stream())
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .distinct()
                .count();

        return AboutResponse.StatsResponse.builder()
                .yearsOfExperience(years + "+")
                .companyCount(experiences.size())
                .technologyCount((int) techCount)
                .referenceCount(references.size())
                .build();
    }
}
