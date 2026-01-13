package com.fsk.blogsitebackend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsk.blogsitebackend.entities.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, UUID> {
    
    Optional<CategoryEntity> findByName(String name);
    
    Optional<CategoryEntity> findBySlug(String slug);
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);
    
}
