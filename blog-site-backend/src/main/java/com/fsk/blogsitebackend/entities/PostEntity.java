package com.fsk.blogsitebackend.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "posts")
@Getter @Setter
public class PostEntity extends BaseEntity {

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "slug", nullable = false, unique = true, length = 500)
    private String slug;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "excerpt", length = 1000)
    private String excerpt;

    @Column(name = "featured_image", length = 1000)
    private String featuredImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PostStatus status = PostStatus.DRAFT;

    @Column(name = "published_at", nullable = true)
    private LocalDateTime publishedAt;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "post_tags",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<TagEntity> tags = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "post_categories",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<CategoryEntity> categories = new HashSet<>();

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssetEntity> assets = new ArrayList<>(); // Images, GIFs, Videos - S3 veya dosya sisteminde tutulur

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    public enum PostStatus {
        DRAFT,
        PUBLISHED,
        SCHEDULED,
        DELETED
    }

    public static PostStatus getStatus(PostStatus status) {
        return status != null ? status : PostStatus.DRAFT;
    }

    public List<String> getTagNames() {
        if (tags == null) {
            return null;
        }
        return tags.stream().map(TagEntity::getName).collect(java.util.stream.Collectors.toList());
    }

}
