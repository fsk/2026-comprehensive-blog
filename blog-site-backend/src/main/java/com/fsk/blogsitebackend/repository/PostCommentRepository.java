package com.fsk.blogsitebackend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsk.blogsitebackend.entities.PostComment;

public interface PostCommentRepository extends JpaRepository<PostComment, UUID> {

    List<PostComment> findByPostId(UUID postId);

    List<PostComment> findByAuthorId(UUID authorId);

    List<PostComment> findByParentCommentId(UUID parentCommentId);

    List<PostComment> findByPostIdAndParentCommentIdIsNull(UUID postId); // Top-level comments

    List<PostComment> findByPostIdAndIsActiveTrue(UUID postId); // Only active (not soft-deleted) comments

}
