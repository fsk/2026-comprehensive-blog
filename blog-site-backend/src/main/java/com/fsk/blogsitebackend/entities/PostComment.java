package com.fsk.blogsitebackend.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "post_comments")
@Getter @Setter
public class PostComment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id", nullable = true)
    private PostComment parentComment; // Nested comments için (reply to comment)

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content; // Markdown formatında içerik (kod blokları ve resimler markdown syntax ile)

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "comment_mentioned_users",
        joinColumns = @JoinColumn(name = "comment_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> mentionedUsers = new HashSet<>(); // @ mention ile tag'lenen kullanıcılar

}
