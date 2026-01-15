import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Edit2, TrendingUp } from 'lucide-react';
import PostService from '../services/api';
import type { Post } from '../types';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import CodeBlock from '../components/ui/CodeBlock';
import CommentSection from '../components/comments/CommentSection';
import ReadingProgress from '../components/ui/ReadingProgress';
import TableOfContents from '../components/ui/TableOfContents';

const PostDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Post | null | undefined>(null);
    const [loading, setLoading] = useState(true);
    const [readingTime, setReadingTime] = useState(0);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    useEffect(() => {
        if (slug) {
            const fetchPost = async () => {
                try {
                    const data = await PostService.getPostBySlug(slug);
                    setPost(data);
                    setReadingTime(calculateReadingTime(data.content));

                    // Fetch related posts
                    if (data.categories && data.categories.length > 0) {
                        const related = await PostService.getAllPosts({ category: data.categories[0].slug });
                        setRelatedPosts(related.content.filter(p => p.id !== data.id).slice(0, 3));
                    }
                } catch (error) {
                    console.error("Failed to fetch post", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <Layout>
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA580C]"></div>
                </div>
            </Layout>
        );
    }

    if (!post) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <h1 className="text-3xl font-bold text-slate-300">İçerik bulunamadı</h1>
                    <Link to="/" className="text-[#EA580C] hover:text-[#FBBF24] mt-4 inline-block font-bold">
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </Layout>
        );
    }

    // No longer using pastelVariants for badges

    return (
        <Layout>
            <ReadingProgress />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-[#EA580C] transition-colors mb-8 group"
                            >
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                <span className="text-sm font-medium">Yazılara Geri Dön</span>
                            </Link>

                            <header className="mb-10">
                                <div className="flex items-center gap-3 mb-6 flex-wrap">
                                    {post.categories?.map((cat) => (
                                        <Badge key={cat.id} variant="primary">{cat.name}</Badge>
                                    ))}
                                    <div className="flex items-center gap-2 text-[#EA580C] bg-[#EA580C]/10 px-3 py-1 rounded-full border border-[#EA580C]/20">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{post.tags?.[0]?.name || 'Genel'}</span>
                                    </div>
                                    <div className="sm:ml-auto">
                                        <Link
                                            to={`/admin/posts/${post.slug}/edit`}
                                            className="inline-flex items-center gap-2 text-sm font-bold text-[#EA580C] hover:text-white hover:bg-[#EA580C] px-4 py-1.5 rounded-xl border-2 border-[#EA580C] transition-all active:scale-95 shadow-md shadow-orange-500/10"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            DÜZENLE
                                        </Link>
                                    </div>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Draft'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#EA580C] dark:text-[#FBBF24]/80">
                                        <Clock className="w-4 h-4 text-[#FBBF24]" />
                                        <span>{readingTime} dk okuma</span>
                                    </div>
                                </div>
                            </header>

                            {post.featuredImage && (
                                <div className="relative aspect-video mb-12 rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tight
                                prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400
                                prose-a:text-[#EA580C] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-3xl prose-img:shadow-xl
                                prose-code:text-[#EA580C] dark:prose-code:text-[#FBBF24] prose-code:bg-[#FBBF24]/5 dark:prose-code:bg-[#FBBF24]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
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
                                    {post.content}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-100/10">
                                <CommentSection slug={post.slug} />
                            </div>
                        </article>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="mt-20">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] rounded-full"></span>
                                    Benzer Yazılar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedPosts.map((rp) => (
                                        <Link
                                            key={rp.id}
                                            to={`/posts/${rp.slug}`}
                                            className="group bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-[#EA580C]/50 hover:shadow-[#EA580C]/10 transition-all active:scale-[0.98] shadow-sm hover:shadow-xl"
                                        >
                                            <div className="aspect-[16/10] overflow-hidden">
                                                <img
                                                    src={rp.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop'}
                                                    alt={rp.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#EA580C]">
                                                        {rp.categories?.[0]?.name}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug transition-colors group-hover:text-[#EA580C]">
                                                    {rp.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <TableOfContents content={post.content} />
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default PostDetail;
