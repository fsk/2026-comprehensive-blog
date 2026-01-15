package com.fsk.blogsitebackend.dto.category;

import com.fsk.blogsitebackend.dto.category.categoryrequest.CreateCategoryRequest;
import com.fsk.blogsitebackend.entities.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    CategoryEntity toEntity(CreateCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    void updateCategoryFromRequest(CreateCategoryRequest request, @MappingTarget CategoryEntity category);
}
