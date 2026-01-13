import { useEffect, useState } from 'react';
import PostService from '../../services/api';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { MessageSquare } from 'lucide-react';
import type { Comment } from '../../types';

interface CommentSectionProps {
    slug: string;
}

const CommentSection = ({ slug }: CommentSectionProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const data = await PostService.getComments(slug);
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchComments();
        }
    }, [slug]);

    const handleSubmitComment = async (content: string) => {
        setSubmitLoading(true);
        try {
            await PostService.createComment(slug, { content });
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Failed to submit comment', error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        try {
            await PostService.createComment(slug, { content, parentId });
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Failed to submit reply', error);
            throw error; // Let the child component handle error state if needed
        }
    };

    if (loading) return null;

    return (
        <section className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#EA580C]" />
                Yorumlar
                <span className="text-lg font-normal text-slate-500 dark:text-slate-400">({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})</span>
            </h3>

            <div className="mb-12">
                <CommentForm
                    onSubmit={handleSubmitComment}
                    loading={submitLoading}
                />
            </div>

            <div className="space-y-10">
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                    />
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CommentSection;
