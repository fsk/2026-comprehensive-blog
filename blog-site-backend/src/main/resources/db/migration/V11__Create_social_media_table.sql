CREATE TABLE social_media (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon_name VARCHAR(255) NOT NULL,
    display_order INTEGER
);

INSERT INTO social_media (id, version, created_at, updated_at, is_active, name, url, icon_name, display_order)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, 'Twitter', 'https://twitter.com/0xfsk', 'Twitter', 1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, 'Instagram', 'https://instagram.com/furkansahinkulaksiz', 'Instagram', 2),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, 'LeetCode', 'https://leetcode.com/fskdev', 'LeetCode', 3),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, 'Medium', 'https://medium.com/@fskdev', 'Medium', 4),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, 'LinkedIn', 'https://linkedin.com/frknshnklksz', 'LinkedIn', 5),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, 'GitHub', 'https://github.com/fsk', 'Github', 6),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, 'YouTube', 'https://www.youtube.com/@fskcode', 'Youtube', 7);
