package com.fsk.blogsitebackend.service;

import java.time.LocalDateTime;
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
import com.fsk.blogsitebackend.dto.CreatePostRequest;
import com.fsk.blogsitebackend.dto.PostResponse;
import com.fsk.blogsitebackend.entities.PostEntity;
import com.fsk.blogsitebackend.entities.PostEntity.PostStatus;
import com.fsk.blogsitebackend.entities.TagEntity;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.repository.PostRepository;
import com.fsk.blogsitebackend.repository.TagRepository;
import com.fsk.blogsitebackend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<PostEntity> findAll() {
        return postRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<PostEntity> findById(UUID id) {
        return postRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<PostEntity> findBySlug(String slug) {
        return postRepository.findBySlug(slug);
    }

    @Transactional(readOnly = true)
    public List<PostEntity> findByStatus(PostStatus status) {
        return postRepository.findByStatus(status, Pageable.unpaged()).getContent();
    }

    @Transactional(readOnly = true)
    public List<PostEntity> findByAuthorId(UUID authorId) {
        return postRepository.findByAuthorId(authorId, Pageable.unpaged()).getContent();
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
            author = userRepository.findAll().stream().findFirst()
                    .orElseThrow(NoUsersFoundException::new);
        }

        PostEntity post = new PostEntity();
        post.setTitle(request.getTitle());
        post.setSlug(request.getSlug());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setFeaturedImage(request.getFeaturedImage());
        post.setStatus(request.getStatus() != null ? request.getStatus() : PostStatus.DRAFT);
        post.setAuthor(author);

        if (post.getStatus() == PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }

        // Handle Tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
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
            post.setTags(tagEntities);
        }

        PostEntity savedPost = postRepository.save(post);
        return mapToResponse(savedPost);
    }

    public PostEntity update(UUID id, PostEntity post) {
        PostEntity existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        existingPost.setTitle(post.getTitle());
        existingPost.setSlug(post.getSlug());
        existingPost.setContent(post.getContent());
        existingPost.setExcerpt(post.getExcerpt());
        existingPost.setFeaturedImage(post.getFeaturedImage());
        existingPost.setStatus(post.getStatus());
        existingPost.setPublishedAt(post.getPublishedAt());
        existingPost.setViewCount(post.getViewCount());
        existingPost.setAuthor(post.getAuthor());
        existingPost.setTags(post.getTags());
        existingPost.setCategories(post.getCategories());

        return postRepository.save(existingPost);
    }

    public void deleteById(UUID id) {
        postRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsBySlug(String slug) {
        return postRepository.existsBySlug(slug);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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

        return postsPage.map(this::mapToResponse);
    }

    public Optional<PostResponse> getPostBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .map(this::mapToResponse);
    }

    public PostResponse updatePost(UUID id, CreatePostRequest request) {
        PostEntity existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        existingPost.setTitle(request.getTitle());
        existingPost.setSlug(request.getSlug());
        existingPost.setContent(request.getContent());
        existingPost.setExcerpt(request.getExcerpt());
        existingPost.setFeaturedImage(request.getFeaturedImage());
        if (request.getStatus() != null) {
            existingPost.setStatus(request.getStatus());
        }

        // Update tags logic similar to create...
        if (request.getTags() != null) {
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

        return mapToResponse(postRepository.save(existingPost));
    }

    public PostResponse mapToResponse(PostEntity post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setSlug(post.getSlug());
        response.setContent(post.getContent());
        response.setExcerpt(post.getExcerpt());
        response.setFeaturedImage(post.getFeaturedImage());
        response.setStatus(post.getStatus());
        response.setPublishedAt(post.getPublishedAt());
        response.setViewCount(post.getViewCount());

        if (post.getAuthor() != null) {
            PostResponse.AuthorResponse authorResponse = new PostResponse.AuthorResponse();
            authorResponse.setId(post.getAuthor().getId());
            authorResponse.setUsername(post.getAuthor().getUsername());
            authorResponse.setFullName(post.getAuthor().getFullName());
            authorResponse.setAvatarUrl(post.getAuthor().getAvatarUrl());
            response.setAuthor(authorResponse);
        }

        if (post.getTags() != null) {
            response.setTags(post.getTags().stream().map(TagEntity::getName).collect(Collectors.toList()));
        }

        return response;
    }

}
