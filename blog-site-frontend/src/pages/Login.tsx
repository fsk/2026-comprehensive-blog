import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogIn, Eye, EyeOff, User } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { setCurrentUser } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulating authentication delay and mock success
        setTimeout(() => {
            // Mocking a successful login
            // In a real scenario, this would be an API call verifying credentials
            if (formData.identifier && formData.password) {
                setCurrentUser({
                    id: 'mock-user-id-123',
                    username: formData.identifier.includes('@') ? formData.identifier.split('@')[0] : formData.identifier,
                    fullName: 'Test Kullanıcı',
                    role: 'USER',
                    unreadNotificationCount: 0,
                });
                navigate('/');
            } else {
                setError('Lütfen tüm alanları doldurunuz.');
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50/50 dark:bg-transparent">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#EA580C] to-[#FBBF24] rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20 transform hover:rotate-6 transition-transform">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                            Hoş Geldiniz
                        </h1>
                        <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
                            Devam etmek için giriş yapın
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Kullanıcı Adı veya E-posta</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#EA580C] transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="identifier"
                                        required
                                        value={formData.identifier}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#EA580C]/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white"
                                        placeholder="Kullanıcı adınız"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Şifre</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#EA580C] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#EA580C]/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-bold text-[#EA580C] hover:text-[#FBBF24] transition-colors">
                                    Şifremi Unuttum
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/10 disabled:opacity-50 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Giriş Yapılıyor...
                                    </>
                                ) : (
                                    'Giriş Yap'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Hesabınız yok mu?{' '}
                                <Link to="/register" className="text-[#EA580C] hover:text-[#FBBF24] font-bold">
                                    Hemen Kayıt Ol
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                            © 2026 Furkan Sahin Kulaksiz
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
