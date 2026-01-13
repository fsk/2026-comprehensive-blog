import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CategoryDropdownProps {
    categories: Category[];
    selectedId: string;
    onSelect: (categoryId: string) => void;
    placeholder?: string;
}

const CategoryDropdown = ({ categories, selectedId, onSelect, placeholder = "Kategori Seçin" }: CategoryDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCategory = categories.find(cat => cat.id === selectedId);

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return <span>{text}</span>;
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="bg-[#FBBF24]/30 dark:bg-[#FBBF24]/20 text-[#EA580C] dark:text-[#FBBF24] rounded-sm px-0.5 font-bold">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    return (
        <div className="relative category-dropdown-container" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (isOpen) setSearchQuery('');
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border ${isOpen ? 'border-[#FBBF24] ring-2 ring-[#FBBF24]/10' : 'border-slate-200 dark:border-slate-700'} rounded-xl text-sm font-medium transition-all group hover:border-[#EA580C] outline-none`}
            >
                <div className="flex items-center gap-3">
                    <Filter className={`w-4 h-4 ${selectedId ? 'text-[#EA580C]' : 'text-slate-400'} group-hover:text-[#EA580C] transition-colors`} />
                    <span className={selectedId ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}>
                        {selectedCategory ? selectedCategory.name : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Kategori ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredCategories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                    onSelect(cat.id);
                                    setIsOpen(false);
                                    setSearchQuery('');
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#FBBF24]/10 ${selectedId === cat.id ? 'text-[#EA580C] dark:text-[#FBBF24] bg-[#FBBF24]/5 dark:bg-[#FBBF24]/5' : 'text-slate-600 dark:text-slate-400'}`}
                            >
                                {highlightText(cat.name, searchQuery)}
                            </button>
                        ))}
                        {filteredCategories.length === 0 && (
                            <div className="px-4 py-6 text-center text-xs text-slate-400 italic">
                                Sonuç bulunamadı
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
