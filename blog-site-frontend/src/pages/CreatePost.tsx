import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../components/ui/CodeBlock';
import MarkdownToolbar from '../components/ui/MarkdownToolbar';
import PostService, { CategoryService } from '../services/api';
import { Save, Eye, PenTool, Plus, Settings, Check } from 'lucide-react';
import CategoryDropdown from '../components/ui/CategoryDropdown';
import { useToast } from '../context/ToastContext';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { AlertCircle, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';


const CreatePost = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({ name: '', slug: '', description: '' });
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: '',
        categoryId: '',
        featuredImage: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-generate slug from title if slug is empty
            slug: name === 'title' && !prev.slug ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : (name === 'slug' ? value : prev.slug)
        }));
    };

    const handleCategoryAction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await CategoryService.updateCategory(editingCategory.id, categoryFormData);
            } else {
                await CategoryService.createCategory(categoryFormData);
            }
            setCategoryFormData({ name: '', slug: '', description: '' });
            setEditingCategory(null);
            fetchCategories();
            showToast(editingCategory ? 'Kategori güncellendi' : 'Yeni kategori eklendi', 'success');
        } catch (error) {
            console.error('Category action failed', error);
            showToast('Kategori işlemi başarısız oldu', 'error');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            try {
                await CategoryService.deleteCategory(id);
                fetchCategories();
                if (formData.categoryId === id) {
                    setFormData(prev => ({ ...prev, categoryId: '' }));
                }
                showToast('Kategori silindi', 'success');
            } catch (error) {
                console.error('Failed to delete category', error);
                showToast('Kategori silinemedi', 'error');
            }
        }
    };

    const handleInsert = (prefix: string, suffix: string = '') => {
        const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;
        const selection = text.substring(start, end);

        const newText = text.substring(0, start) + prefix + selection + suffix + text.substring(end);

        setFormData(prev => ({ ...prev, content: newText }));

        // Restore focus and set selection to cover the wrapped text (or cursor position inside)
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + selection.length + suffix.length;
            // If there was a selection, keep it selected inside (optional, or just place cursor at end)
            // For now, place cursor after insertion
            textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.categoryId) {
            showToast('Lütfen bir kategori seçin.', 'info');
            return;
        }
        setLoading(true);

        try {
            // Process tags to strings
            const tagsList = formData.tags.split(',').map(t => t.trim()).filter(t => t);

            await PostService.createPost({
                ...formData,
                tags: tagsList,
                status: 'PUBLISHED',
                featuredImage: ''
            });

            showToast('Yazı başarıyla yayınlandı!', 'success');
            navigate('/');
        } catch (error) {
            console.error('Failed to create post', error);
            showToast('Yazı yayınlanırken bir hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Metadata Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Başlık</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#FBBF24]/50 outline-none transition-all"
                                        placeholder="Yazı başlığı girin"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Öne Çıkan Görsel URL</label>
                                    <input
                                        type="text"
                                        name="featuredImage"
                                        value={formData.featuredImage}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#FBBF24]/50 outline-none transition-all"
                                        placeholder="Görsel URL (Örn: https://...)"
                                    />
                                    {formData.featuredImage && (
                                        <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                                            <img
                                                src={formData.featuredImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop')}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#FBBF24]/50 outline-none font-mono text-sm transition-all"
                                        placeholder="post-url-slug"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</label>
                                        <button
                                            onClick={() => setShowCategoryManager(!showCategoryManager)}
                                            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-all ${showCategoryManager ? 'bg-[#EA580C] text-white shadow-lg shadow-orange-500/20' : 'text-[#EA580C] hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/5'}`}
                                        >
                                            <Settings className="w-3.5 h-3.5" />
                                            {showCategoryManager ? 'Kapat' : 'Yönet'}
                                        </button>
                                    </div>
                                    <CategoryDropdown
                                        categories={categories}
                                        selectedId={formData.categoryId}
                                        onSelect={(id) => setFormData(prev => ({ ...prev, categoryId: id }))}
                                        placeholder="Kategori Seçin"
                                    />
                                </div>

                                {showCategoryManager && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                                        <form onSubmit={handleCategoryAction} className="space-y-3 mb-4">
                                            <input
                                                type="text"
                                                placeholder="Kategori Adı"
                                                value={categoryFormData.name}
                                                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#FBBF24]/50 transition-all"
                                                required
                                            />
                                            <textarea
                                                placeholder="Kategori Açıklaması"
                                                value={categoryFormData.description}
                                                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#FBBF24]/50 transition-all resize-none"
                                            />
                                            <button
                                                type="submit"
                                                className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-sky-600 text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                                            >
                                                {editingCategory ? <><Check className="w-4 h-4" /> Güncelle</> : <><Plus className="w-4 h-4" /> Yeni Kategori</>}
                                            </button>
                                        </form>

                                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                            {categories.map(cat => (
                                                <div key={cat.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm shadow-transparent hover:shadow-slate-100 dark:hover:shadow-none">
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">{cat.name}</span>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            className="p-1 px-2 text-[10px] font-bold text-[#EA580C] hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/5 rounded"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setEditingCategory(cat);
                                                                setCategoryFormData({ name: cat.name, slug: cat.slug, description: cat.description || '' });
                                                            }}
                                                        >
                                                            DÜZENLE
                                                        </button>
                                                        <button
                                                            className="p-1 px-2 text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded"
                                                            onClick={(e) => { e.preventDefault(); handleDeleteCategory(cat.id); }}
                                                        >
                                                            SİL
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Etiketler</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#FBBF24]/50 outline-none transition-all"
                                        placeholder="java, react, spring"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Özet</label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#FBBF24]/50 outline-none resize-none transition-all text-sm"
                                        placeholder="Kısa özet..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Editor */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                                <button
                                    onClick={() => setActiveTab('write')}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'write'
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <PenTool className="w-4 h-4" />
                                    Yaz
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'preview'
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <Eye className="w-4 h-4" />
                                    Önizleme
                                </button>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] hover:opacity-90 text-white px-8 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-orange-500/25 active:scale-95"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Yayınlanıyor...' : 'Yayınla'}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[750px] flex flex-col relative z-0 shadow-sm overflow-visible">
                            {activeTab === 'write' ? (
                                <>
                                    <MarkdownToolbar onInsert={handleInsert} />
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        className="w-full flex-grow p-8 bg-transparent text-slate-900 dark:text-slate-100 outline-none font-mono resize-none leading-relaxed text-lg"
                                        placeholder="# Merhaba Dünya"
                                    />
                                </>
                            ) : (
                                <div className="p-8 prose prose-lg max-w-none font-sans dark:prose-invert 
                  prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 
                  prose-p:text-slate-700 dark:prose-p:text-slate-300 
                  prose-a:text-[#EA580C] dark:prose-a:text-[#FBBF24] prose-a:no-underline hover:prose-a:underline 
                  prose-code:text-[#EA580C] dark:prose-code:text-[#FBBF24] prose-code:bg-slate-100 dark:prose-code:bg-slate-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                ">
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeRaw]}
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                        components={{
                                            blockquote: ({ children, ...props }: any) => {
                                                // Extract the content from children to check for alert patterns
                                                // ReactMarkdown processes the content, so children might be an array of elements
                                                // We need to look for the alert syntax in the first paragraph's text

                                                const content = children?.filter((child: any) => child?.type !== '\n');
                                                const firstChild = content?.[0];

                                                if (firstChild?.type === 'p' && firstChild?.props?.children) {
                                                    const textContent = Array.isArray(firstChild.props.children)
                                                        ? firstChild.props.children.map(String).join('')
                                                        : String(firstChild.props.children);

                                                    const alertMatch = textContent.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);

                                                    if (alertMatch) {
                                                        const type = alertMatch[1];
                                                        // Remove the [!TYPE] part and leading/trailing whitespace
                                                        const cleanText = textContent.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '');

                                                        // Update the first paragraph with clean text
                                                        const newFirstChild = {
                                                            ...firstChild,
                                                            props: {
                                                                ...firstChild.props,
                                                                children: cleanText
                                                            }
                                                        };

                                                        // Replace first child with cleaned one
                                                        const newChildren = [newFirstChild, ...content.slice(1)];

                                                        const alertStyles: Record<string, { bg: string, border: string, text: string, icon: React.ReactElement, title: string }> = {
                                                            NOTE: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-200', icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />, title: 'Note' },
                                                            TIP: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-200', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, title: 'Tip' },
                                                            IMPORTANT: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-800 dark:text-violet-200', icon: <AlertCircle className="w-5 h-5 text-violet-600 dark:text-violet-400" />, title: 'Important' },
                                                            WARNING: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-200', icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />, title: 'Warning' },
                                                            CAUTION: { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-800 dark:text-rose-200', icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />, title: 'Caution' }
                                                        };

                                                        const style = alertStyles[type as keyof typeof alertStyles] || alertStyles.NOTE;

                                                        return (
                                                            <div className={`my-4 ml-0 rounded-lg border-l-4 ${style.bg} ${style.border} p-4`}>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    {style.icon}
                                                                    <span className={`text-sm font-bold ${style.text} uppercase tracking-wide`}>{style.title}</span>
                                                                </div>
                                                                <div className={`text-slate-700 dark:text-slate-300 ${style.text}`}>
                                                                    {newChildren}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                }

                                                return <blockquote {...props} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-1 italic bg-slate-50 dark:bg-slate-800 rounded-r">{children}</blockquote>;
                                            },
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
                                        {formData.content || '*Önizlenecek bir şey yok*'}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </Layout >
    );
};

export default CreatePost;
