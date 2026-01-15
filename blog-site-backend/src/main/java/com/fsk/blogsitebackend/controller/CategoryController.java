package com.fsk.blogsitebackend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;
import com.fsk.blogsitebackend.common.SuccessMessages;
import com.fsk.blogsitebackend.dto.category.categoryrequest.CreateCategoryRequest;
import com.fsk.blogsitebackend.entities.CategoryEntity;
import com.fsk.blogsitebackend.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<GenericResponse<List<CategoryEntity>>> getAllCategories() {
        List<CategoryEntity> categories = categoryService.findAll();
        return ResponseUtil.successResponse(categories, SuccessMessages.CATEGORIES_RETRIEVED, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<GenericResponse<UUID>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        UUID savedCategoryId = categoryService.create(request);
        return ResponseUtil.successResponse(savedCategoryId, SuccessMessages.CATEGORY_CREATED, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<CategoryEntity>> updateCategory(@PathVariable UUID id, @Valid @RequestBody CreateCategoryRequest request) {
        CategoryEntity updatedCategory = categoryService.update(id, request);
        return ResponseUtil.successResponse(updatedCategory, SuccessMessages.CATEGORY_UPDATED, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponse<Void>> deleteCategory(@PathVariable UUID id) {
        categoryService.delete(id);
        return ResponseUtil.successResponse(null, SuccessMessages.CATEGORY_DELETED, HttpStatus.OK);
    }
}
