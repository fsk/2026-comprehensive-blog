package com.fsk.blogsitebackend.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fsk.blogsitebackend.entities.Experience;

public interface ExperienceRepository extends JpaRepository<Experience, UUID> {
    List<Experience> findAllByOrderByDisplayOrderAsc();
}
