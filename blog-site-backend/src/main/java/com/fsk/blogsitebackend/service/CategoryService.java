package com.fsk.blogsitebackend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.category.CategoryMapper;
import com.fsk.blogsitebackend.dto.category.categoryrequest.CreateCategoryRequest;
import com.fsk.blogsitebackend.entities.CategoryEntity;
import com.fsk.blogsitebackend.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    
    @Transactional(readOnly = true)
    public List<CategoryEntity> findAll() {
        return categoryRepository.findAll();
    }

    public CategoryEntity save(CategoryEntity category) {
        return categoryRepository.save(category);
    }

    public UUID create(CreateCategoryRequest request) {
        CategoryEntity category = categoryMapper.toEntity(request);
        return categoryRepository.save(category).getId();
    }

    @Transactional
    public CategoryEntity update(UUID id, CreateCategoryRequest request) {
        CategoryEntity existingCategory = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryMapper.updateCategoryFromRequest(request, existingCategory);
        return categoryRepository.save(existingCategory);
    }

    public void delete(UUID id) {
        categoryRepository.deleteById(id);
    }

    
}
