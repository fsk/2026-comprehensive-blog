import { useState } from 'react';
import MarkdownToolbar from '../ui/MarkdownToolbar';
import { Send, Loader2 } from 'lucide-react';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    placeholder?: string;
    loading?: boolean;
}

const CommentForm = ({ onSubmit, placeholder = "Write a comment...", loading = false }: CommentFormProps) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        await onSubmit(content);
        setContent('');
    };

    const handleInsert = (prefix: string, suffix: string = '') => {
        const textarea = document.querySelector('textarea[name="comment-content"]') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = content;
        const selection = text.substring(start, end);

        const newText = text.substring(0, start) + prefix + selection + suffix + text.substring(end);
        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + selection.length + suffix.length;
            textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        }, 0);
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-[#FBBF24]/20 transition-shadow">
                <div className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                    <MarkdownToolbar onInsert={handleInsert} />
                </div>
                <textarea
                    name="comment-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full p-4 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-y min-h-[100px]"
                />
                <div className="p-2 flex justify-end bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50">
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] hover:shadow-lg hover:shadow-orange-500/20 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        GÖNDER
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;
