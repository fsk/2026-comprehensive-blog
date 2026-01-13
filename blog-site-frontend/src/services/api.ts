import axios from 'axios';
import type { Post, PostListResponse, Comment, SocialMedia } from '../types';

const API_URL = 'http://localhost:8079/api';

export interface CreatePostRequest {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
    tags: string[];
    categoryId: string;
    authorId?: string;
}

export interface CreateCommentRequest {
    content: string;
    parentId?: string;
}

// Backend GenericResponse wrapper type
interface GenericResponse<T> {
    success: boolean;  // Backend serializes 'isSuccess' as 'success' due to Lombok getter naming
    message: string;
    data: T;
    error: string | null;
    status: string;
    timestamp: string;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const PostService = {
    getAllPosts: async (params?: { category?: string; tag?: string; search?: string; page?: number; size?: number }): Promise<PostListResponse> => {
        const response = await api.get<GenericResponse<any>>('/posts', { params });
        const pageData = response.data.data;

        return {
            content: pageData.content,
            pageNo: pageData.number,
            pageSize: pageData.size,
            totalElements: pageData.totalElements,
            totalPages: pageData.totalPages,
            last: pageData.last
        };
    },

    getPostBySlug: async (slug: string): Promise<Post> => {
        const response = await api.get<GenericResponse<Post>>(`/posts/${slug}`);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Post not found');
        }
        return response.data.data;
    },

    createPost: async (post: CreatePostRequest): Promise<Post> => {
        const response = await api.post<GenericResponse<Post>>('/posts', post);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to create post');
        }
        return response.data.data;
    },

    updatePost: async (id: string, post: CreatePostRequest): Promise<Post> => {
        const response = await api.put<GenericResponse<Post>>(`/posts/${id}`, post);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to update post');
        }
        return response.data.data;
    },

    getComments: async (slug: string): Promise<Comment[]> => {
        const response = await api.get<GenericResponse<Comment[]>>(`/posts/${slug}/comments`);
        return response.data.data;
    },

    createComment: async (slug: string, comment: CreateCommentRequest, userId?: string): Promise<Comment> => {
        const headers: Record<string, string> = {};
        if (userId) {
            headers['X-User-Id'] = userId;
        }
        const response = await api.post<GenericResponse<Comment>>(`/posts/${slug}/comments`, comment, { headers });
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to create comment');
        }
        return response.data.data;
    },

    deleteComment: async (slug: string, commentId: string, userId: string): Promise<void> => {
        await api.delete(`/posts/${slug}/comments/${commentId}`, {
            headers: { 'X-User-Id': userId }
        });
    }
};

// Notification types
import type { Notification, CurrentUser } from '../types';

export const NotificationService = {
    getNotifications: async (userId: string): Promise<Notification[]> => {
        const response = await api.get<GenericResponse<Notification[]>>('/notifications', {
            headers: { 'X-User-Id': userId }
        });
        return response.data.data;
    },

    getUnreadCount: async (userId: string): Promise<number> => {
        const response = await api.get<GenericResponse<number>>('/notifications/count', {
            headers: { 'X-User-Id': userId }
        });
        return response.data.data;
    },

    markAsRead: async (notificationId: string, userId: string): Promise<void> => {
        await api.put(`/notifications/${notificationId}/read`, null, {
            headers: { 'X-User-Id': userId }
        });
    },

    markAllAsRead: async (userId: string): Promise<void> => {
        await api.put('/notifications/read-all', null, {
            headers: { 'X-User-Id': userId }
        });
    }
};

// Mock current user for development (simulates auth)
export const getCurrentUser = (): CurrentUser | null => {
    // For development: store user in localStorage
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
};

export const setCurrentUser = (user: CurrentUser | null): void => {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
};

export const CategoryService = {
    getAllCategories: async (): Promise<any[]> => {
        const response = await api.get<GenericResponse<any[]>>('/categories');
        return response.data.data;
    },

    createCategory: async (category: { name: string; slug: string; description: string }): Promise<any> => {
        const response = await api.post<GenericResponse<any>>('/categories', category);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to create category');
        }
        return response.data.data;
    },

    updateCategory: async (id: string, category: { name: string; slug: string; description: string }): Promise<any> => {
        const response = await api.put<GenericResponse<any>>(`/categories/${id}`, category);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to update category');
        }
        return response.data.data;
    },

    deleteCategory: async (id: string): Promise<void> => {
        const response = await api.delete<GenericResponse<void>>(`/categories/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to delete category');
        }
    }
};

export const SocialMediaService = {
    getActiveSocialMedia: async (): Promise<SocialMedia[]> => {
        const response = await api.get<GenericResponse<SocialMedia[]>>('/social-media');
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to fetch social media links');
        }
        return response.data.data;
    },

    getAllSocialMedia: async (): Promise<SocialMedia[]> => {
        const response = await api.get<GenericResponse<SocialMedia[]>>('/social-media/admin');
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to fetch all social media links');
        }
        return response.data.data;
    },

    createSocialMedia: async (social: Partial<SocialMedia>): Promise<SocialMedia> => {
        const response = await api.post<GenericResponse<SocialMedia>>('/social-media/admin', social);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to create social media link');
        }
        return response.data.data;
    },

    updateSocialMedia: async (id: string, social: Partial<SocialMedia>): Promise<SocialMedia> => {
        const response = await api.put<GenericResponse<SocialMedia>>(`/social-media/admin/${id}`, social);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to update social media link');
        }
        return response.data.data;
    },

    deleteSocialMedia: async (id: string): Promise<void> => {
        const response = await api.delete<GenericResponse<void>>(`/social-media/admin/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to delete social media link');
        }
    },

    toggleActiveStatus: async (id: string): Promise<void> => {
        const response = await api.patch<GenericResponse<void>>(`/social-media/admin/${id}/toggle`);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to toggle status');
        }
    }
};

export default PostService;
