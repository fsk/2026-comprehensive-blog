
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-slate-500 dark:text-slate-500 text-sm font-mono">
                            &copy; {new Date().getFullYear()} FSK. All rights reserved.
                        </p>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500 text-sm italic">
                        <span>Built with</span>
                        <Heart className="h-4 w-4 text-[#EA580C] fill-[#EA580C]" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EA580C] to-[#FBBF24] font-bold">and Spring Boot</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
