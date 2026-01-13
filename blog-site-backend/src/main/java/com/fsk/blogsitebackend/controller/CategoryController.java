package com.fsk.blogsitebackend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.service.CategoryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @org.springframework.web.bind.annotation.GetMapping
    public org.springframework.http.ResponseEntity<com.fsk.blogsitebackend.common.GenericResponse<java.util.List<com.fsk.blogsitebackend.entities.CategoryEntity>>> getAllCategories() {
        java.util.List<com.fsk.blogsitebackend.entities.CategoryEntity> categories = categoryService.findAll();
        com.fsk.blogsitebackend.common.GenericResponse<java.util.List<com.fsk.blogsitebackend.entities.CategoryEntity>> response = com.fsk.blogsitebackend.common.GenericResponse.<java.util.List<com.fsk.blogsitebackend.entities.CategoryEntity>>builder()
                .isSuccess(true)
                .message("Categories retrieved successfully")
                .data(categories)
                .status(org.springframework.http.HttpStatus.OK)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return org.springframework.http.ResponseEntity.ok(response);
    }
}
