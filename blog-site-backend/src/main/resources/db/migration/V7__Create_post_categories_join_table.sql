-- Create post_categories join table (ManyToMany relationship between posts and categories)
CREATE TABLE post_categories (
    post_id UUID NOT NULL,
    category_id UUID NOT NULL,
    
    PRIMARY KEY (post_id, category_id),
    CONSTRAINT fk_post_categories_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
