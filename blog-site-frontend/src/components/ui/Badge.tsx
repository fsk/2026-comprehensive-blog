import { twMerge } from 'tailwind-merge';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'pastel-red' | 'pastel-orange' | 'pastel-yellow' | 'pastel-green' | 'pastel-blue' | 'pastel-purple' | 'pastel-pink';
    className?: string;
    onClick?: () => void;
}

const Badge = ({ children, variant = 'primary', className, onClick }: BadgeProps) => {
    const variants = {
        primary: 'bg-[#FBBF24]/10 text-[#EA580C] dark:text-[#FBBF24] border-[#FBBF24]/20',
        secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600',
        outline: 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500',
        accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        'pastel-red': 'bg-pastel-red/20 text-red-600 dark:text-pastel-red border-pastel-red/30',
        'pastel-orange': 'bg-pastel-orange/20 text-orange-600 dark:text-pastel-orange border-pastel-orange/30',
        'pastel-yellow': 'bg-pastel-yellow/20 text-amber-600 dark:text-pastel-yellow border-pastel-yellow/30',
        'pastel-green': 'bg-pastel-green/20 text-emerald-600 dark:text-pastel-green border-pastel-green/30',
        'pastel-blue': 'bg-pastel-blue/20 text-blue-600 dark:text-pastel-blue border-pastel-blue/30',
        'pastel-purple': 'bg-pastel-purple/20 text-purple-600 dark:text-pastel-purple border-pastel-purple/30',
        'pastel-pink': 'bg-pastel-pink/20 text-pink-600 dark:text-pastel-pink border-pastel-pink/30',
    };

    return (
        <span
            className={twMerge(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono transition-colors',
                variants[variant],
                onClick && 'cursor-pointer hover:bg-opacity-20',
                className
            )}
            onClick={onClick}
        >
            {children}
        </span>
    );
};

export default Badge;
