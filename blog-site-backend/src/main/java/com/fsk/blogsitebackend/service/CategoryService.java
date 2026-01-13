package com.fsk.blogsitebackend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.entities.CategoryEntity;
import com.fsk.blogsitebackend.repository.CategoryRepository;

@Service
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    @Transactional(readOnly = true)
    public List<CategoryEntity> findAll() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<CategoryEntity> findById(UUID id) {
        return categoryRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<CategoryEntity> findByName(String name) {
        return categoryRepository.findByName(name);
    }
    
    @Transactional(readOnly = true)
    public Optional<CategoryEntity> findBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }
    
    public CategoryEntity save(CategoryEntity category) {
        return categoryRepository.save(category);
    }
    
    public CategoryEntity update(UUID id, CategoryEntity category) {
        CategoryEntity existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        existingCategory.setName(category.getName());
        existingCategory.setSlug(category.getSlug());
        existingCategory.setDescription(category.getDescription());
        
        return categoryRepository.save(existingCategory);
    }
    
    public void deleteById(UUID id) {
        categoryRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
    
    @Transactional(readOnly = true)
    public boolean existsBySlug(String slug) {
        return categoryRepository.existsBySlug(slug);
    }
    
}
