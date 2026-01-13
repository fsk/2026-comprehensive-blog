-- Add notification preferences to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT true NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unread_notification_count INTEGER DEFAULT 0 NOT NULL;

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    version BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    related_post_slug VARCHAR(255),
    related_comment_id UUID
);

-- Index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
