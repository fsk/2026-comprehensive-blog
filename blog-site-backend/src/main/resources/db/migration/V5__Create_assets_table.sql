-- Create assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    post_id UUID NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    alt_text VARCHAR(500),
    caption VARCHAR(500),
    
    CONSTRAINT fk_assets_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
