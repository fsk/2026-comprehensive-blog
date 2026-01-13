-- Create post_comments table
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    post_id UUID NOT NULL,
    author_id UUID NOT NULL,
    parent_comment_id UUID NULL,
    content TEXT NOT NULL,
    
    CONSTRAINT fk_post_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_comments_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_post_comments_parent FOREIGN KEY (parent_comment_id) REFERENCES post_comments(id) ON DELETE CASCADE
);

-- Create comment_mentioned_users join table (ManyToMany relationship for @ mentions)
CREATE TABLE comment_mentioned_users (
    comment_id UUID NOT NULL,
    user_id UUID NOT NULL,
    
    PRIMARY KEY (comment_id, user_id),
    CONSTRAINT fk_comment_mentioned_users_comment FOREIGN KEY (comment_id) REFERENCES post_comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_mentioned_users_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
