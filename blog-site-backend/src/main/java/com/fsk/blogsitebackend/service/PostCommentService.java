package com.fsk.blogsitebackend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.entities.PostComment;
import com.fsk.blogsitebackend.repository.PostCommentRepository;

@Service
@Transactional
public class PostCommentService {
    
    private final PostCommentRepository postCommentRepository;
    
    public PostCommentService(PostCommentRepository postCommentRepository) {
        this.postCommentRepository = postCommentRepository;
    }
    
    @Transactional(readOnly = true)
    public List<PostComment> findAll() {
        return postCommentRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<PostComment> findById(UUID id) {
        return postCommentRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<PostComment> findByPostId(UUID postId) {
        return postCommentRepository.findByPostId(postId);
    }
    
    @Transactional(readOnly = true)
    public List<PostComment> findByAuthorId(UUID authorId) {
        return postCommentRepository.findByAuthorId(authorId);
    }
    
    @Transactional(readOnly = true)
    public List<PostComment> findByParentCommentId(UUID parentCommentId) {
        return postCommentRepository.findByParentCommentId(parentCommentId);
    }
    
    @Transactional(readOnly = true)
    public List<PostComment> findTopLevelCommentsByPostId(UUID postId) {
        return postCommentRepository.findByPostIdAndParentCommentIdIsNull(postId);
    }
    
    public PostComment save(PostComment comment) {
        return postCommentRepository.save(comment);
    }
    
    public PostComment update(UUID id, PostComment comment) {
        PostComment existingComment = postCommentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        
        existingComment.setContent(comment.getContent());
        existingComment.setMentionedUsers(comment.getMentionedUsers());
        existingComment.setParentComment(comment.getParentComment());
        
        return postCommentRepository.save(existingComment);
    }
    
    public void deleteById(UUID id) {
        postCommentRepository.deleteById(id);
    }
    
}
