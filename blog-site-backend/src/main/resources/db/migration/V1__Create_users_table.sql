-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    bio VARCHAR(1000),
    avatar_url VARCHAR(1000),
    location VARCHAR(200),
    last_login_at TIMESTAMP NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    email_verified BOOLEAN NOT NULL DEFAULT false,
    
    -- Sosyal medya linkleri
    twitter_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    instagram_url VARCHAR(500),
    facebook_url VARCHAR(500),
    youtube_url VARCHAR(500),
    website_url VARCHAR(500)
);
