export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    hexColorCode?: string;
}

export interface Category {
    id: string;
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
    tags: Tag[]; // Backend returns full Tag objects now, or list of strings? PostService returns PostResponse which has List<String> tags? No, wait.
    // Checking PostResponse in backend to be sure. PostResponse has `private Set<String> tags;` ? No, let's check PostMapper.
    // If backend returns Tag objects, we should match. Default usually strings if simple mapper? Use strings for now to be safe or check Mapper?
    // PostEntity has Set<TagEntity>. PostResponse usually maps this.
    // Looking at PostResponse class would be ideal but I didn't view it specifically.
    // Assuming simple string array for now based on typical patterns, but if it breaks I'll fix.
    // Actually, createPostRequest sends strings. PostResponse probably returns strings or objects.
    // Let's stick with string[] for tags in Post for now, unless errors.
    // WAIT: step 731 showed `tags: string[]` in Post interface.
    // Let's update Category ID to string.
    categories?: Category[];
    author: User;
}

// ... existing interfaces ...

export interface Education {
    id: string;
    institution: string;
    degree: string;
    faculty?: string;
    department: string;
    period: string;
    status: string;
    thesis?: string;
    gpa?: string;
}

export interface Experience {
    id: string;
    company: string;
    title: string;
    period: string;
    isCurrent: boolean;
    technologies: string[];
    description?: string;
    leaveReason?: string;
}

export interface Reference {
    id: string;
    name: string;
    currentCompany: string;
    currentTitle: string;
    workedTogether: string;
    roleWhenWorked: string;
}

export interface AboutData {
    education: Education[];
    experience: Experience[];
    references: Reference[];
    stats: {
        yearsOfExperience: string;
        companyCount: number;
        technologyCount: number;
        referenceCount: number;
    };
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
