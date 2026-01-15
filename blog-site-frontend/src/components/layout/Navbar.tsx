import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Moon, Sun, Instagram, LogOut, User, Twitter, Youtube, ChevronDown, ExternalLink, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../ui/NotificationBell';
import { getCurrentUser, setCurrentUser, SocialMediaService } from '../../services/api';
import type { SocialMedia } from '../../types';

import { LeetCodeIcon, MediumIcon } from '../ui/BrandIcons';

const IconMap: Record<string, React.FC<{ className?: string }>> = {
    Twitter,
    Instagram,
    Github,
    Linkedin,
    Youtube,
    LeetCode: LeetCodeIcon,
    Medium: MediumIcon
};

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showSocials, setShowSocials] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [user, setUser] = useState(getCurrentUser());
    const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await SocialMediaService.getActiveSocialMedia();
                setSocialLinks(data);
            } catch (error) {
                console.error("Failed to fetch socials", error);
            }
        };
        fetchSocials();

        const handleAuthChange = () => {
            setUser(getCurrentUser());
        };
        window.addEventListener('storage', handleAuthChange);
        return () => window.removeEventListener('storage', handleAuthChange);
    }, []);

    const handleLogout = () => {
        setCurrentUser(null);
        setUser(null);
        navigate('/');
        window.dispatchEvent(new Event('storage'));
    };

    const navLinks = [
        { name: 'Yazılar', path: '/' },
        { name: 'Hakkımda', path: '/about' },
        { name: 'İletişim', path: '/contact' },
    ];

    const hoverUnderlineClass = "relative after:absolute after:bottom-0 after:left-0 after:h-[3px] after:bg-gradient-to-r after:from-[#EA580C] after:to-[#FBBF24] after:transition-all after:duration-300";

    return (
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 relative">
                    {/* Mobile Menu Button (Left on mobile, hidden on desktop) */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-pastel-pink dark:hover:text-white transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>

                    {/* Centered Navigation Links */}
                    <div className="hidden md:flex flex-1 justify-center items-center">
                        <div className="flex items-baseline space-x-8">
                            {navLinks.map((link) => {
                                const isActive = link.path === '/'
                                    ? location.pathname === '/'
                                    : location.pathname.startsWith(link.path);

                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`text-slate-900 dark:text-white px-3 py-2 text-sm font-bold transition-all duration-200 ${hoverUnderlineClass} ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}

                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className={`text-slate-900 dark:text-white px-3 py-2 text-sm font-bold transition-all duration-200 ${hoverUnderlineClass} ${location.pathname === '/login' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={`text-slate-900 dark:text-white px-3 py-2 text-sm font-bold transition-all duration-200 ${hoverUnderlineClass} ${location.pathname === '/register' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
                                    >
                                        Kayıt Ol
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                                        <div className="w-8 h-8 rounded-full bg-[#FBBF24]/20 flex items-center justify-center text-[#EA580C] dark:text-[#FBBF24]">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span>{user.fullName}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-400 hover:text-[#EA580C] transition-colors"
                                        title="Çıkış Yap"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            <Link
                                to="/admin/posts/new"
                                className="bg-gradient-to-r from-[#EA580C] to-[#FBBF24] hover:scale-105 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                            >
                                Yazı Yaz
                            </Link>

                            {user?.role === 'ADMIN' && (
                                <Link
                                    to="/admin/announcement"
                                    className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#EA580C] px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:text-[#EA580C] flex items-center gap-2"
                                >
                                    <Bell className="w-4 h-4" />
                                    Duyuru
                                </Link>
                            )}

                            {/* Sosyal Medya Dropdown */}
                            <div className="relative group/socials">
                                <button
                                    onMouseEnter={() => setShowSocials(true)}
                                    className={`flex items-center gap-1.5 text-slate-900 dark:text-white px-3 py-2 text-sm font-bold transition-all duration-200 ${hoverUnderlineClass} group-hover/socials:after:w-full`}
                                >
                                    Sosyal Medya
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSocials ? 'rotate-180' : ''}`} />
                                </button>

                                <div
                                    onMouseLeave={() => setShowSocials(false)}
                                    className={`absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700/50 p-4 transition-all duration-300 origin-top-right z-[60] ${showSocials ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                                >
                                    <div className="grid grid-cols-4 gap-3">
                                        {socialLinks.map((social) => {
                                            const Icon = IconMap[social.iconName] || Twitter;
                                            return (
                                                <a
                                                    key={social.id}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={social.name}
                                                    className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-black dark:border-white hover:border-[#EA580C] dark:hover:border-[#EA580C] transition-all hover:scale-110 active:scale-95 text-slate-900 dark:text-white hover:text-[#EA580C] dark:hover:text-[#FBBF24]"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Takip Edin</p>
                                        <Link
                                            to="/admin/social-media"
                                            className="text-[10px] font-bold text-[#EA580C] hover:text-[#FBBF24] uppercase tracking-widest flex items-center gap-1 transition-colors"
                                            onClick={() => setShowSocials(false)}
                                        >
                                            Yönet <ExternalLink className="w-2.5 h-2.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification & Theme Toggle (Right) */}
                    <div className="flex items-center space-x-4">
                        <NotificationBell />
                        <button
                            onClick={toggleTheme}
                            className="text-slate-500 dark:text-slate-400 hover:text-[#EA580C] transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => {
                            const isActive = link.path === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(link.path);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`block px-3 py-2 rounded-md text-base font-bold transition-colors ${isActive ? 'text-[#EA580C] dark:text-[#FBBF24] bg-orange-50 dark:bg-orange-500/10' : 'text-slate-900 dark:text-white hover:text-[#EA580C] dark:hover:text-[#FBBF24]'}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-900 dark:text-white hover:text-[#EA580C] dark:hover:text-[#FBBF24] block px-3 py-2 rounded-md text-base font-bold transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-slate-900 dark:text-white hover:text-[#EA580C] dark:hover:text-[#FBBF24] block px-3 py-2 rounded-md text-base font-bold transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Kayıt Ol
                                </Link>
                            </>
                        ) : (
                            <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                                    <User className="w-5 h-5 text-[#EA580C] dark:text-[#FBBF24]" />
                                    <span>{user?.fullName}</span>
                                </div>
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="flex items-center gap-2 text-pastel-red font-bold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Çıkış
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => { toggleTheme(); setIsOpen(false); }}
                            className="w-full text-left text-slate-900 dark:text-white hover:text-[#EA580C] dark:hover:text-[#FBBF24] block px-3 py-2 rounded-md text-base font-bold transition-colors"
                        >
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <p className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Sosyal Medya</p>
                            <div className="flex flex-wrap gap-3 px-3">
                                {socialLinks.map((social) => {
                                    const Icon = IconMap[social.iconName] || Twitter;
                                    return (
                                        <a
                                            key={social.id}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-black dark:border-white text-slate-900 dark:text-white"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
