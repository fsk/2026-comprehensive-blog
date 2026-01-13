import { useState, type ReactNode } from 'react';

interface TooltipProps {
    content: string;
    explanation?: string;
    description?: string;
    children: ReactNode;
    position?: 'top' | 'bottom';
}

const Tooltip = ({ content, explanation, description, children, position = 'top' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center justify-center z-50"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={`absolute ${position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900/95 dark:bg-slate-800/98 backdrop-blur-sm text-white rounded-xl shadow-2xl z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200 border border-slate-700/50 min-w-[140px] max-w-[200px] whitespace-normal`}
                >
                    <div className="font-bold text-[11px] mb-0.5 text-slate-100">{content}</div>
                    {explanation && (
                        <div className="text-[10px] text-slate-300 mb-1 leading-snug">
                            {explanation}
                        </div>
                    )}
                    {description && (
                        <div className="text-[10px] leading-relaxed text-slate-400 border-t border-slate-700/50 mt-1 pt-1 italic">
                            <span className="text-[#FBBF24] font-bold not-italic mr-1">Örnek:</span>
                            {description}
                        </div>
                    )}
                    {/* Arrow */}
                    <div
                        className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${position === 'top' ? 'top-full border-t-slate-900/95' : 'bottom-full border-b-slate-900/95'}`}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
