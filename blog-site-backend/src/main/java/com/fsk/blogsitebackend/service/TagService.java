package com.fsk.blogsitebackend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.entities.TagEntity;
import com.fsk.blogsitebackend.repository.TagRepository;

@Service
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Transactional(readOnly = true)
    public List<TagEntity> findAll() {
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<TagEntity> findById(UUID id) {
        return tagRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<TagEntity> findByName(String name) {
        return tagRepository.findByName(name);
    }

    @Transactional(readOnly = true)
    public Optional<TagEntity> findBySlug(String slug) {
        return tagRepository.findBySlug(slug);
    }

    public TagEntity save(TagEntity tag) {
        return tagRepository.save(tag);
    }

    public TagEntity update(UUID id, TagEntity tag) {
        TagEntity existingTag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));

        existingTag.setName(tag.getName());
        existingTag.setSlug(tag.getSlug());
        existingTag.setDescription(tag.getDescription());
        existingTag.setHexColorCode(tag.getHexColorCode());

        return tagRepository.save(existingTag);
    }

    public void deleteById(UUID id) {
        tagRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return tagRepository.existsByName(name);
    }

    @Transactional(readOnly = true)
    public boolean existsBySlug(String slug) {
        return tagRepository.existsBySlug(slug);
    }

}
