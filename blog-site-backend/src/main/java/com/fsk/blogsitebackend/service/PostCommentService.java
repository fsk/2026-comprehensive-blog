package com.fsk.blogsitebackend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.NoUsersFoundException;
import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.comment.CommentMapper;
import com.fsk.blogsitebackend.dto.comment.CommentResponse;
import com.fsk.blogsitebackend.dto.comment.commentrequest.CreateCommentRequest;
import com.fsk.blogsitebackend.entities.Notification.NotificationType;
import com.fsk.blogsitebackend.entities.PostComment;
import com.fsk.blogsitebackend.entities.PostEntity;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.entities.User.UserRole;
import com.fsk.blogsitebackend.repository.PostCommentRepository;
import com.fsk.blogsitebackend.repository.PostRepository;
import com.fsk.blogsitebackend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PostCommentService {
    
    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CommentMapper commentMapper;
    
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

    public CommentResponse createComment(String postSlug, CreateCommentRequest request, UUID authorId) {
        PostEntity post = postRepository.findBySlug(postSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "slug", postSlug));

        User author;
        if (authorId != null) {
            author = userRepository.findById(authorId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));
        } else {
            author = userRepository.findAll().stream().findFirst()
                    .orElseThrow(NoUsersFoundException::new);
        }

        PostComment comment = new PostComment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setAuthor(author);

        if (request.getParentId() != null) {
            PostComment parent = postCommentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", request.getParentId()));
            comment.setParentComment(parent);
        }

        Set<User> mentionedUsers = extractMentions(request.getContent());
        comment.setMentionedUsers(mentionedUsers);

        PostComment savedComment = postCommentRepository.save(comment);

        for (User mentionedUser : mentionedUsers) {
            if (!mentionedUser.getId().equals(author.getId())) {
                String message = String.format("%s sizi bir yorumda etiketledi: \"%s\"",
                        author.getFullName(),
                        truncateMessage(request.getContent(), 50));
                notificationService.createNotification(
                        mentionedUser,
                        NotificationType.MENTION,
                        message,
                        postSlug,
                        savedComment.getId());
            }
        }

        return commentMapper.toResponse(savedComment);
    }

    public void softDeleteComment(UUID commentId, UUID adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminUserId));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can delete comments");
        }

        PostComment comment = postCommentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        commentMapper.applySoftDelete(comment, comment);
        postCommentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsForPost(String postSlug) {
        PostEntity post = postRepository.findBySlug(postSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "slug", postSlug));

        List<PostComment> allComments = postCommentRepository.findByPostIdAndIsActiveTrue(post.getId());

        return buildCommentTree(allComments);
    }

    private List<CommentResponse> buildCommentTree(List<PostComment> allComments) {
        Map<UUID, CommentResponse> commentMap = new HashMap<>();
        List<CommentResponse> roots = new ArrayList<>();

        for (PostComment entity : allComments) {
            CommentResponse dto = commentMapper.toResponse(entity);
            commentMap.put(entity.getId(), dto);
        }

        for (PostComment entity : allComments) {
            CommentResponse dto = commentMap.get(entity.getId());
            if (entity.getParentComment() == null) {
                roots.add(dto);
            } else {
                CommentResponse parentDto = commentMap.get(entity.getParentComment().getId());
                if (parentDto != null) {
                    parentDto.getReplies().add(dto);
                }
            }
        }

        roots.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return roots;
    }

    private Set<User> extractMentions(String content) {
        Set<User> mentionedUsers = new HashSet<>();
        Pattern pattern = Pattern.compile("@(\\w+)");
        Matcher matcher = pattern.matcher(content);

        while (matcher.find()) {
            String username = matcher.group(1);
            userRepository.findByUsername(username).ifPresent(mentionedUsers::add);
        }
        return mentionedUsers;
    }

    private String truncateMessage(String message, int maxLength) {
        if (message.length() <= maxLength) {
            return message;
        }
        return message.substring(0, maxLength) + "...";
    }
}
