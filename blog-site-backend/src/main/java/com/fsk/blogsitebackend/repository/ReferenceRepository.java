package com.fsk.blogsitebackend.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fsk.blogsitebackend.entities.ReferenceJob;

public interface ReferenceRepository extends JpaRepository<ReferenceJob, UUID> {
}
