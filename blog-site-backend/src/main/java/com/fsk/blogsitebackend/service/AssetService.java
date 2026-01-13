package com.fsk.blogsitebackend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.entities.AssetEntity;
import com.fsk.blogsitebackend.repository.AssetRepository;

@Service
@Transactional
public class AssetService {
    
    private final AssetRepository assetRepository;
    
    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }
    
    @Transactional(readOnly = true)
    public List<AssetEntity> findAll() {
        return assetRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<AssetEntity> findById(UUID id) {
        return assetRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<AssetEntity> findByPostId(UUID postId) {
        return assetRepository.findByPostId(postId);
    }
    
    public AssetEntity save(AssetEntity asset) {
        return assetRepository.save(asset);
    }
    
    public AssetEntity update(UUID id, AssetEntity asset) {
        AssetEntity existingAsset = assetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
        
        existingAsset.setAssetType(asset.getAssetType());
        existingAsset.setFilePath(asset.getFilePath());
        existingAsset.setFileName(asset.getFileName());
        existingAsset.setFileSize(asset.getFileSize());
        existingAsset.setMimeType(asset.getMimeType());
        existingAsset.setAltText(asset.getAltText());
        existingAsset.setCaption(asset.getCaption());
        existingAsset.setPost(asset.getPost());
        
        return assetRepository.save(existingAsset);
    }
    
    public void deleteById(UUID id) {
        assetRepository.deleteById(id);
    }
    
}
