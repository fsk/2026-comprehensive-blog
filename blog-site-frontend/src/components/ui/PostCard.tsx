import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Post } from '../../types';
import Badge from './Badge';

interface PostCardProps {
    post: Post;
    featured?: boolean;
    highlight?: string;
}

const PostCard = ({ post, featured = false }: PostCardProps) => {
    return (
        <div className={`group relative bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 transition-all duration-300 hover:border-[#EA580C] dark:hover:border-[#EA580C] hover:shadow-xl hover:shadow-orange-500/5 ${featured ? 'md:col-span-2' : ''}`}>
            <div className="p-6 sm:p-8 flex flex-col h-full relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories && post.categories.length > 0 && (
                        <Badge variant="primary">{post.categories[0].name}</Badge>
                    )}
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(post.publishedAt || Date.now()), 'MMM d, yyyy')}
                    </span>
                </div>

                <Link to={`/posts/${post.slug}`}>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2">
                        {post.title}
                    </h2>
                </Link>

                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 text-sm">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {post.author.avatarUrl ? (
                            <img src={post.author.avatarUrl} alt={post.author.fullName} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-[#FBBF24]/20 flex items-center justify-center text-[10px] font-bold text-[#EA580C] border border-[#FBBF24]/30">
                                {post.author.fullName.charAt(0)}
                            </div>
                        )}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{post.author.fullName}</span>
                    </div>
                    <div className="flex gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag.id} variant="secondary" className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">#{tag.name}</Badge>
                        ))}
                    </div>
                </div>
                <Link
                    to={`/posts/${post.slug}`}
                    className="flex items-center gap-2 text-[#EA580C] dark:text-[#FBBF24] text-sm font-bold transition-all mt-4"
                >
                    OKU <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
