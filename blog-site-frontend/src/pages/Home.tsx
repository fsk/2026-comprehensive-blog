import { useEffect, useState } from 'react';
import PostService, { CategoryService } from '../services/api';
import type { Post } from '../types';
import Layout from '../components/layout/Layout';
import PostCard from '../components/ui/PostCard';
import Typewriter from '../components/ui/Typewriter';
import { Loader2, Search, Filter, ChevronDown } from 'lucide-react';
import Pagination from '../components/ui/Pagination';

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.category-dropdown-container')) {
                setIsCategoryOpen(false);
                setCategorySearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const params: any = {};

                if (searchQuery.startsWith('#')) {
                    params.tag = searchQuery.substring(1);
                } else if (searchQuery) {
                    params.search = searchQuery;
                }

                if (selectedCategory) {
                    params.category = selectedCategory;
                }

                params.page = currentPage;
                params.size = 10;

                const response = await PostService.getAllPosts(params);
                setPosts(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Failed to fetch posts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, searchQuery, selectedCategory]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const handleCategorySelect = (categorySlug: string) => {
        setSelectedCategory(categorySlug);
        setIsCategoryOpen(false);
        setCategorySearchQuery('');
        setCurrentPage(0);
    };

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return <span>{text}</span>;
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="bg-pastel-yellow/40 dark:bg-pastel-yellow/20 text-slate-900 dark:text-pastel-yellow rounded-sm px-0.5 border-b border-pastel-yellow/50">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-8">
                <div className="text-center pt-4 pb-10 sm:pt-6 sm:pb-14">
                    <div className="min-h-[4rem] flex items-center justify-center">
                        <h1 className="text-lg sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FBBF24] tracking-tighter">
                            <Typewriter
                                texts={[
                                    "Furkan Sahin Kulaksiz",
                                    "Java & Spring Boot Specialist",
                                    "React & Frontend Engineer",
                                    "Learning Every Day"
                                ]}
                                typingSpeed={70}
                                deletingSpeed={40}
                                pauseDuration={2500}
                            />
                        </h1>
                    </div>

                    <div className="max-w-3xl mx-auto mt-8 relative flex flex-col sm:flex-row gap-4 items-center px-4">
                        <div className="relative flex-[2] w-full group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                            <input
                                type="text"
                                placeholder="Başlıklarda ara veya #etiket kullan..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#FBBF24]/50 outline-none transition-all shadow-xl shadow-slate-200/20 dark:shadow-none placeholder:text-slate-400 font-medium"
                            />
                            {/* Gradient border effect on focus */}
                            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-focus-within:border-none transition-all">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FBBF24] opacity-0 group-focus-within:opacity-10 transition-opacity" />
                            </div>
                        </div>

                        <div className="relative flex-1 w-full sm:w-auto category-dropdown-container">
                            <button
                                onClick={() => {
                                    setIsCategoryOpen(!isCategoryOpen);
                                    if (isCategoryOpen) setCategorySearchQuery('');
                                }}
                                className={`w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900/50 border ${isCategoryOpen ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/10' : 'border-slate-200 dark:border-slate-800'} rounded-2xl text-sm font-bold transition-all shadow-xl shadow-slate-200/20 dark:shadow-none group hover:border-[#F59E0B]`}
                            >
                                <div className="flex items-center gap-3">
                                    <Filter className={`w-4 h-4 ${selectedCategory ? 'text-[#F59E0B]' : 'text-slate-400'} group-hover:text-[#F59E0B] transition-colors`} />
                                    <span className={selectedCategory ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}>
                                        {selectedCategory ? (categories.find(c => c.slug === selectedCategory)?.name || 'Kategori') : 'Kategori'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoryOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 overflow-hidden">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="Kategori ara..."
                                                value={categorySearchQuery}
                                                onChange={(e) => setCategorySearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#F59E0B] outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        <button
                                            onClick={() => handleCategorySelect('')}
                                            className={`w-full px-6 py-3 text-left text-sm font-medium transition-colors hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/20 ${selectedCategory === '' ? 'text-[#EA580C] dark:text-[#FBBF24] bg-[#FBBF24]/5 dark:bg-[#FBBF24]/10' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            {highlightText('Tüm Kategoriler', categorySearchQuery)}
                                        </button>
                                        {filteredCategories.map((cat: any) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategorySelect(cat.slug)}
                                                className={`w-full px-6 py-3 text-left text-sm font-medium transition-colors hover:bg-[#F59E0B]/10 dark:hover:bg-[#F59E0B]/20 ${selectedCategory === cat.slug ? 'text-[#EA580C] dark:text-[#FBBF24] bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10' : 'text-slate-600 dark:text-slate-400'}`}
                                            >
                                                {highlightText(cat.name, categorySearchQuery)}
                                            </button>
                                        ))}
                                        {filteredCategories.length === 0 && (
                                            <div className="px-6 py-8 text-center text-xs text-slate-400 italic">
                                                Sonuç bulunamadı
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    {selectedCategory && (
                        <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Filtrelenen Kategori:</span>
                            <span className="px-3 py-1 bg-[#FBBF24]/20 text-[#EA580C] dark:text-[#FBBF24] text-xs font-bold rounded-full border border-[#FBBF24]/30">
                                {categories.find((c: any) => c.slug === selectedCategory)?.name || selectedCategory}
                            </span>
                            <button
                                onClick={() => setSelectedCategory('')}
                                className="text-xs text-slate-400 hover:text-red-500 underline underline-offset-4 ml-2 transition-colors"
                            >
                                Temizle
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#F59E0B]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {posts.map((post: Post, index: number) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    featured={currentPage === 0 && index === 0}
                                    highlight={searchQuery}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
