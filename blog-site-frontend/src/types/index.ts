export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface User {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown
    excerpt?: string;
    featuredImage?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
    publishedAt?: string; // ISO Date string
    viewCount: number;
    tags: string[];
    categories?: Category[];
    author: User;
}

export interface Comment {
    id: string;
    content: string; // Markdown
    createdAt: string;
    author: User;
    parentId?: string;
    replies?: Comment[];
}

export interface PostListResponse {
    content: Post[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface Notification {
    id: string;
    type: 'MENTION' | 'NEW_POST' | 'REPLY';
    message: string;
    isRead: boolean;
    relatedPostSlug?: string;
    relatedCommentId?: string;
    createdAt: string;
}

export interface CurrentUser {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
    role: 'ADMIN' | 'AUTHOR' | 'USER';
    unreadNotificationCount: number;
}

export interface SocialMedia {
    id: string;
    name: string;
    url: string;
    iconName: string;
    displayOrder: number;
    isActive: boolean;
}
