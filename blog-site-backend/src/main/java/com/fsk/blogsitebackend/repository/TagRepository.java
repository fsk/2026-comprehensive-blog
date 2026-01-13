package com.fsk.blogsitebackend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsk.blogsitebackend.entities.TagEntity;

public interface TagRepository extends JpaRepository<TagEntity, UUID> {
    
    Optional<TagEntity> findByName(String name);
    
    Optional<TagEntity> findBySlug(String slug);
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);
    
}
