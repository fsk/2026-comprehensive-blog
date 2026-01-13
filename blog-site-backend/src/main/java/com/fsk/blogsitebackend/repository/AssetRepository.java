package com.fsk.blogsitebackend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsk.blogsitebackend.entities.AssetEntity;

public interface AssetRepository extends JpaRepository<AssetEntity, UUID> {
    
    List<AssetEntity> findByPostId(UUID postId);
    
}
