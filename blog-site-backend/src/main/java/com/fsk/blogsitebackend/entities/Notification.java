package com.fsk.blogsitebackend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Bildirimi alan kullanıcı

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private NotificationType type;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "related_post_slug", length = 255)
    private String relatedPostSlug; // İlgili post'a link için

    @Column(name = "related_comment_id")
    private java.util.UUID relatedCommentId; // İlgili yoruma link için

    public enum NotificationType {
        MENTION, // Bir yorumda mention edildiğinde
        NEW_POST, // Yeni blog post yayınlandığında (email pref true ise)
        REPLY // Yoruma cevap geldiğinde
    }
}
