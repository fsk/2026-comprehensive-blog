import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface ToCItem {
    id: string;
    text: string;
    level: number;
}

const TableOfContents = ({ content }: { content: string }) => {
    const [toc, setToc] = useState<ToCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Extract headings from markdown
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const items: ToCItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2];
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            items.push({ id, text, level });
        }
        setToc(items);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0% -35% 0%' }
        );

        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach((heading) => {
            // Check if the heading text matches any of our ToC items to ensure we only observe relevant sections
            const id = heading.textContent?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            if (id) {
                heading.id = id;
                observer.observe(heading);
            }
        });

        return () => observer.disconnect();
    }, [toc]);

    if (toc.length === 0) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100 font-bold">
                <List className="w-4 h-4 text-[#EA580C]" />
                <span className="text-sm">İçindekiler</span>
            </div>
            <nav className="space-y-1">
                {toc.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`
                            block text-xs font-medium py-1.5 transition-all
                            ${item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-3' : 'pl-6'}
                            ${activeId === item.id
                                ? 'text-[#EA580C] dark:text-[#FBBF24] border-l-2 border-[#EA580C] pl-2 -ml-2 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-[#EA580C]/80 dark:hover:text-[#FBBF24]/80'}
                        `}
                    >
                        {item.text}
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default TableOfContents;
