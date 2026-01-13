package com.fsk.blogsitebackend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fsk.blogsitebackend.entities.PostEntity;
import com.fsk.blogsitebackend.entities.PostEntity.PostStatus;

public interface PostRepository extends JpaRepository<PostEntity, UUID> {

    Optional<PostEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<PostEntity> findByStatus(PostStatus status, Pageable pageable);

    @Query("SELECT p FROM PostEntity p WHERE p.author.id = :authorId")
    Page<PostEntity> findByAuthorId(@Param("authorId") UUID authorId, Pageable pageable);

    @Query("SELECT p FROM PostEntity p JOIN p.categories c WHERE c.slug = :categorySlug")
    Page<PostEntity> findByCategorySlug(@Param("categorySlug") String categorySlug, Pageable pageable);

    @Query("SELECT p FROM PostEntity p JOIN p.tags t WHERE t.slug = :tagSlug")
    Page<PostEntity> findByTagSlug(@Param("tagSlug") String tagSlug, Pageable pageable);

    @Query("SELECT p FROM PostEntity p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<PostEntity> searchByTitle(@Param("query") String query, Pageable pageable);
}
