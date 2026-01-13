import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className={twMerge("flex items-center justify-center space-x-2 mt-12", className)}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#EA580C] hover:text-[#EA580C] dark:hover:text-[#FBBF24] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={clsx(
                            "w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 font-mono",
                            currentPage === page
                                ? "bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white shadow-lg shadow-orange-500/20 scale-110"
                                : "text-slate-600 dark:text-slate-400 hover:bg-[#FBBF24]/10 hover:text-[#EA580C] dark:hover:text-[#FBBF24] border border-transparent hover:border-[#FBBF24]/30"
                        )}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#EA580C] hover:text-[#EA580C] dark:hover:text-[#FBBF24] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
