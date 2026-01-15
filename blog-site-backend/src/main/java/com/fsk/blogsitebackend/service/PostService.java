package com.fsk.blogsitebackend.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.NoUsersFoundException;
import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.common.exception.SlugAlreadyExistsException;
import com.fsk.blogsitebackend.dto.post.postrequest.CreatePostRequest;
import com.fsk.blogsitebackend.dto.post.PostMapper;
import com.fsk.blogsitebackend.dto.post.PostResponse;
import com.fsk.blogsitebackend.entities.PostEntity;
import com.fsk.blogsitebackend.entities.PostEntity.PostStatus;
import com.fsk.blogsitebackend.entities.TagEntity;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.repository.PostRepository;
import com.fsk.blogsitebackend.repository.TagRepository;
import com.fsk.blogsitebackend.repository.UserRepository;
import com.fsk.blogsitebackend.repository.CategoryRepository;
import com.fsk.blogsitebackend.entities.CategoryEntity;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final CategoryRepository categoryRepository;
    private final PostMapper postMapper;

    @Transactional(readOnly = true)
    public Optional<PostResponse> findResponseBySlug(String slug) {
        return postRepository.findBySlug(slug).map(postMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<PostEntity> findByStatus(PostStatus status) {
        return postRepository.findByStatus(status, Pageable.unpaged()).getContent();
    }

    public PostEntity save(PostEntity post) {
        return postRepository.save(post);
    }

    public PostResponse createPost(CreatePostRequest request) {
        if (postRepository.existsBySlug(request.getSlug())) {
            throw new SlugAlreadyExistsException(request.getSlug());
        }

        User author;
        if (request.getAuthorId() != null) {
            author = userRepository.findById(request.getAuthorId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAuthorId()));
        } else {
            author = userRepository.findAll().stream().findFirst().orElseThrow(NoUsersFoundException::new);
        }

        PostEntity post = postMapper.toEntity(request);
        postMapper.updateAuthor(author, post);

        if (post.getStatus() == PostStatus.PUBLISHED) {
            postMapper.updatePublishedAt(java.time.LocalDateTime.now(), post);
        }

        // Handle Tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            handleTags(request, post);
        }

        // Handle Categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            handleCategories(request, post);
        }

        PostEntity savedPost = postRepository.save(post);
        return postMapper.toResponse(savedPost);
    }

    public PostEntity update(UUID id, PostEntity post) {
        PostEntity existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        postMapper.updateFromEntity(post, existingPost);
        return postRepository.save(existingPost);
    }

    public void deleteById(UUID id) {
        PostEntity existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        postMapper.applySoftDelete(existingPost, existingPost);
        postRepository.save(existingPost);
    }

    @Transactional(readOnly = true)
    public boolean existsBySlug(String slug) {
        return postRepository.existsBySlug(slug);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream().map(postMapper::toResponse).collect(Collectors.toList());
    }

    public Page<PostResponse> getFilteredPosts(String category, String tag, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<PostEntity> postsPage;

        if (category != null && !category.isEmpty()) {
            postsPage = postRepository.findByCategorySlug(category, pageable);
        } else if (tag != null && !tag.isEmpty()) {
            postsPage = postRepository.findByTagSlug(tag, pageable);
        } else if (search != null && !search.isEmpty()) {
            postsPage = postRepository.searchByTitle(search, pageable);
        } else {
            postsPage = postRepository.findAll(pageable);
        }

        return postsPage.map(postMapper::toResponse);
    }

    public PostResponse updatePost(UUID id, CreatePostRequest request) {
        PostEntity existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        postMapper.updateFromRequest(request, existingPost);

        if (request.getTags() != null) {
            handleTags(request, existingPost);
        }

        if (request.getCategoryIds() != null) {
            handleCategories(request, existingPost);
        }

        return postMapper.toResponse(postRepository.save(existingPost));
    }

    private void handleTags(CreatePostRequest request, PostEntity existingPost) {
        Set<TagEntity> tagEntities = new HashSet<>();
        for (String tagName : request.getTags()) {
            String slug = tagName.toLowerCase().replace(" ", "-");
            TagEntity tag = tagRepository.findBySlug(slug)
                    .orElseGet(() -> {
                        TagEntity newTag = new TagEntity();
                        newTag.setName(tagName);
                        newTag.setSlug(slug);
                        return tagRepository.save(newTag);
                    });
            tagEntities.add(tag);
        }
        existingPost.setTags(tagEntities);
    }

    private void handleCategories(CreatePostRequest request, PostEntity existingPost) {
        Set<CategoryEntity> categoryEntities = new HashSet<>();
        for (UUID categoryId : request.getCategoryIds()) {
            CategoryEntity category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
            categoryEntities.add(category);
        }
        existingPost.setCategories(categoryEntities);
    }

}
