import { useState } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import CodeBlock from '../ui/CodeBlock';
import CommentForm from './CommentForm';
import { Reply } from 'lucide-react';
import type { Comment } from '../../types';

interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: string, content: string) => Promise<void>;
    depth?: number;
}

const CommentItem = ({ comment, onReply, depth = 0 }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);

    const handleReplySubmit = async (content: string) => {
        setReplyLoading(true);
        try {
            await onReply(comment.id, content);
            setIsReplying(false);
        } finally {
            setReplyLoading(false);
        }
    };

    return (
        <div className={`group ${depth > 0 ? 'ml-0 pl-4 sm:pl-8 border-l-2 border-slate-100 dark:border-slate-800' : ''}`}>
            <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                    {comment.author.avatarUrl ? (
                        <img src={comment.author.avatarUrl} alt={comment.author.fullName} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#EA580C]/10 flex items-center justify-center text-[#EA580C] font-bold border border-[#EA580C]/20 uppercase">
                            {comment.author.fullName.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {comment.author.fullName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {format(new Date(comment.createdAt || Date.now()), 'MMM d, yyyy • h:mm a')}
                        </span>
                    </div>

                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-3 break-words
                        prose-p:my-1 prose-headings:my-2
                        prose-pre:bg-slate-100 dark:prose-pre:bg-slate-900 prose-pre:p-0 prose-pre:rounded-lg
                    ">
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                pre: ({ children }: any) => <>{children}</>,
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <CodeBlock
                                            language={match[1]}
                                            value={String(children).replace(/\n$/, '')}
                                        />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {comment.content}
                        </ReactMarkdown>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#EA580C] transition-colors"
                        >
                            <Reply className="w-4 h-4" />
                            Reply
                        </button>
                    </div>

                    {isReplying && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <CommentForm
                                onSubmit={handleReplySubmit}
                                placeholder={`Replying to ${comment.author.fullName}...`}
                                loading={replyLoading}
                            />
                        </div>
                    )}
                </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-6 mt-6">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
