package com.fsk.blogsitebackend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "assets")
@Getter @Setter
public class AssetEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false, length = 50)
    private AssetType assetType;

    @Column(name = "file_path", nullable = false, length = 1000)
    private String filePath; // S3 veya dosya sistemi path/URL

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize; // Byte cinsinden

    @Column(name = "mime_type", length = 100)
    private String mimeType; // image/jpeg, image/png, image/gif, vb.

    @Column(name = "alt_text", length = 500)
    private String altText; // SEO için

    @Column(name = "caption", length = 500)
    private String caption; // Görsel açıklaması

    public enum AssetType {
        IMAGE,
        GIF,
        VIDEO,
        DOCUMENT
    }

}
