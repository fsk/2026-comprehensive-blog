package com.fsk.blogsitebackend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.NoUsersFoundException;
import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.CommentResponse;
import com.fsk.blogsitebackend.dto.CreateCommentRequest;
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
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final PostCommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentResponse createComment(String postSlug, CreateCommentRequest request, UUID authorId) {
        PostEntity post = postRepository.findBySlug(postSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "slug", postSlug));

        User author;
        if (authorId != null) {
            author = userRepository.findById(authorId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));
        } else {
            // Fallback for testing - use first user
            author = userRepository.findAll().stream().findFirst()
                    .orElseThrow(NoUsersFoundException::new);
        }

        PostComment comment = new PostComment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setAuthor(author);

        if (request.getParentId() != null) {
            PostComment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", request.getParentId()));
            comment.setParentComment(parent);
        }

        // Handle Mentions and create notifications
        Set<User> mentionedUsers = extractMentions(request.getContent());
        comment.setMentionedUsers(mentionedUsers);

        PostComment savedComment = commentRepository.save(comment);

        // Create notifications for mentioned users
        for (User mentionedUser : mentionedUsers) {
            if (!mentionedUser.getId().equals(author.getId())) { // Don't notify self
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

        return mapToResponse(savedComment);
    }

    public void softDeleteComment(UUID commentId, UUID adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminUserId));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can delete comments");
        }

        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        comment.setIsActive(false);
        comment.setDeletedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsForPost(String postSlug) {
        PostEntity post = postRepository.findBySlug(postSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "slug", postSlug));

        // Only get active comments
        List<PostComment> allComments = commentRepository.findByPostIdAndIsActiveTrue(post.getId());

        return buildCommentTree(allComments);
    }

    private List<CommentResponse> buildCommentTree(List<PostComment> allComments) {
        Map<UUID, CommentResponse> commentMap = new HashMap<>();
        List<CommentResponse> roots = new ArrayList<>();

        for (PostComment entity : allComments) {
            CommentResponse dto = mapToResponse(entity);
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

    private CommentResponse mapToResponse(PostComment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        if (comment.getParentComment() != null) {
            response.setParentId(comment.getParentComment().getId());
        }

        CommentResponse.AuthorResponse author = new CommentResponse.AuthorResponse();
        author.setId(comment.getAuthor().getId());
        author.setUsername(comment.getAuthor().getUsername());
        author.setFullName(comment.getAuthor().getFullName());
        author.setAvatarUrl(comment.getAuthor().getAvatarUrl());
        response.setAuthor(author);

        return response;
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
