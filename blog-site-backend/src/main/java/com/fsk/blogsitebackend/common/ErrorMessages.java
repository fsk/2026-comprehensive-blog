package com.fsk.blogsitebackend.common;

public class ErrorMessages {

    // User errors
    public static final String FAILED_TO_RETRIEVE_USERS = "Failed to retrieve users";
    public static final String FAILED_TO_RETRIEVE_USER = "Failed to retrieve user";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String USER_NOT_FOUND_WITH_ID = "User not found with id: %s";
    public static final String USER_NOT_FOUND_WITH_USERNAME = "User not found with username: %s";
    public static final String USER_NOT_FOUND_WITH_EMAIL = "User not found with email: %s";
    public static final String FAILED_TO_CREATE_USER = "Failed to create user";
    public static final String FAILED_TO_UPDATE_USER = "Failed to update user";
    public static final String FAILED_TO_DELETE_USER = "Failed to delete user";
    public static final String FAILED_TO_CHECK_USERNAME_EXISTENCE = "Failed to check username existence";
    public static final String FAILED_TO_CHECK_EMAIL_EXISTENCE = "Failed to check email existence";

    // Post errors
    public static final String FAILED_TO_RETRIEVE_POSTS = "Failed to retrieve posts";
    public static final String FAILED_TO_RETRIEVE_POST = "Failed to retrieve post";
    public static final String POST_NOT_FOUND = "Post not found";
    public static final String POST_NOT_FOUND_WITH_ID = "Post not found with id: %s";
    public static final String POST_NOT_FOUND_WITH_SLUG = "Post not found with slug: %s";
    public static final String FAILED_TO_CREATE_POST = "Failed to create post";
    public static final String FAILED_TO_UPDATE_POST = "Failed to update post";
    public static final String FAILED_TO_DELETE_POST = "Failed to delete post";
    public static final String INVALID_STATUS = "Invalid status: %s";

    // Tag errors
    public static final String FAILED_TO_RETRIEVE_TAGS = "Failed to retrieve tags";
    public static final String FAILED_TO_RETRIEVE_TAG = "Failed to retrieve tag";
    public static final String TAG_NOT_FOUND = "Tag not found";
    public static final String TAG_NOT_FOUND_WITH_ID = "Tag not found with id: %s";
    public static final String TAG_NOT_FOUND_WITH_NAME = "Tag not found with name: %s";
    public static final String TAG_NOT_FOUND_WITH_SLUG = "Tag not found with slug: %s";
    public static final String FAILED_TO_CREATE_TAG = "Failed to create tag";
    public static final String FAILED_TO_UPDATE_TAG = "Failed to update tag";
    public static final String FAILED_TO_DELETE_TAG = "Failed to delete tag";
    public static final String FAILED_TO_CHECK_TAG_NAME_EXISTENCE = "Failed to check tag name existence";
    public static final String FAILED_TO_CHECK_TAG_SLUG_EXISTENCE = "Failed to check tag slug existence";

    // Category errors
    public static final String FAILED_TO_RETRIEVE_CATEGORIES = "Failed to retrieve categories";
    public static final String FAILED_TO_RETRIEVE_CATEGORY = "Failed to retrieve category";
    public static final String CATEGORY_NOT_FOUND = "Category not found";
    public static final String CATEGORY_NOT_FOUND_WITH_ID = "Category not found with id: %s";
    public static final String CATEGORY_NOT_FOUND_WITH_NAME = "Category not found with name: %s";
    public static final String CATEGORY_NOT_FOUND_WITH_SLUG = "Category not found with slug: %s";
    public static final String FAILED_TO_CREATE_CATEGORY = "Failed to create category";
    public static final String FAILED_TO_UPDATE_CATEGORY = "Failed to update category";
    public static final String FAILED_TO_DELETE_CATEGORY = "Failed to delete category";
    public static final String FAILED_TO_CHECK_CATEGORY_NAME_EXISTENCE = "Failed to check category name existence";
    public static final String FAILED_TO_CHECK_CATEGORY_SLUG_EXISTENCE = "Failed to check category slug existence";

    // Asset errors
    public static final String FAILED_TO_RETRIEVE_ASSETS = "Failed to retrieve assets";
    public static final String FAILED_TO_RETRIEVE_ASSET = "Failed to retrieve asset";
    public static final String ASSET_NOT_FOUND = "Asset not found";
    public static final String ASSET_NOT_FOUND_WITH_ID = "Asset not found with id: %s";
    public static final String FAILED_TO_CREATE_ASSET = "Failed to create asset";
    public static final String FAILED_TO_UPDATE_ASSET = "Failed to update asset";
    public static final String FAILED_TO_DELETE_ASSET = "Failed to delete asset";

    // Comment errors
    public static final String FAILED_TO_RETRIEVE_COMMENTS = "Failed to retrieve comments";
    public static final String FAILED_TO_RETRIEVE_COMMENT = "Failed to retrieve comment";
    public static final String COMMENT_NOT_FOUND = "Comment not found";
    public static final String COMMENT_NOT_FOUND_WITH_ID = "Comment not found with id: %s";
    public static final String FAILED_TO_CREATE_COMMENT = "Failed to create comment";
    public static final String FAILED_TO_UPDATE_COMMENT = "Failed to update comment";
    public static final String FAILED_TO_DELETE_COMMENT = "Failed to delete comment";

    // General errors
    public static final String RUNTIME_ERROR = "An error occurred";
    public static final String UNEXPECTED_ERROR = "An unexpected error occurred";
    public static final String DATABASE_ACCESS_ERROR = "An error occurred while accessing the database";
    public static final String DATA_INTEGRITY_VIOLATION = "Data integrity violation";
    public static final String DUPLICATE_SLUG = "Slug already exists";
    public static final String NO_USERS_FOUND = "No users available in the system";
    public static final String DUPLICATE_RECORD = "A record with this value already exists";
    public static final String REFERENCED_RECORD_NOT_FOUND = "Referenced record does not exist";
    public static final String REQUIRED_FIELD_NULL = "Required field cannot be null";
    public static final String VALIDATION_FAILED = "Data does not meet validation requirements";
    public static final String VALUE_TOO_LONG = "Value exceeds maximum length";
    public static final String DATA_INTEGRITY_DEFAULT = "Data integrity violation occurred";

    private ErrorMessages() {
        // Utility class - prevent instantiation
    }

}
