package com.fsk.blogsitebackend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.tag.TagMapper;
import com.fsk.blogsitebackend.dto.tag.TagResponse;
import com.fsk.blogsitebackend.dto.tag.tagrequest.CreateTagRequest;
import com.fsk.blogsitebackend.entities.TagEntity;
import com.fsk.blogsitebackend.repository.TagRepository;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    @Transactional(readOnly = true)
    public List<TagEntity> findAll() {
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<TagResponse> findAllResponses() {
        return tagRepository.findAll().stream()
                .map(tagMapper::toResponse)
                .collect(Collectors.toList());
    }

    public TagEntity save(TagEntity tag) {
        return tagRepository.save(tag);
    }

    public UUID create(CreateTagRequest request) {
        TagEntity tag = tagMapper.toEntity(request);
        return tagRepository.save(tag).getId();
    }

    @Transactional
    public TagEntity update(UUID id, CreateTagRequest request) {
        TagEntity existingTag = tagRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));
        tagMapper.updateTagFromRequest(request, existingTag);
        return tagRepository.save(existingTag);
    }

    @Transactional
    public TagResponse updateResponse(UUID id, CreateTagRequest request) {
        TagEntity updatedTag = update(id, request);
        return tagMapper.toResponse(updatedTag);
    }

    public void delete(UUID id) {
        TagEntity existingTag = tagRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));
        TagEntity deletedTag = tagMapper.applySoftDelete(existingTag);
        tagRepository.save(deletedTag);
    }

}
