package com.fsk.blogsitebackend.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fsk.blogsitebackend.entities.Education;

public interface EducationRepository extends JpaRepository<Education, UUID> {
}
