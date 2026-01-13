import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Bell, BellOff } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { setCurrentUser } from '../services/api';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    emailNotificationsEnabled: boolean;
}

const API_URL = 'http://localhost:8079/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        emailNotificationsEnabled: true,
    });
    const [errors, setErrors] = useState<Partial<RegisterFormData> & { general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterFormData> = {};

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Şifre en az 6 karakter olmalıdır';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        if (!formData.firstName) {
            newErrors.firstName = 'Ad zorunludur';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Soyad zorunludur';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    emailNotificationsEnabled: formData.emailNotificationsEnabled,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Kayıt başarısız oldu');
            }

            // Store user in localStorage (mock auth)
            setCurrentUser({
                id: data.data.id,
                username: data.data.username,
                fullName: data.data.fullName,
                role: data.data.role,
                unreadNotificationCount: 0,
            });

            // Redirect to home
            navigate('/');
        } catch (error: any) {
            setErrors({ general: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof RegisterFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#EA580C] to-[#FBBF24] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Kayıt Ol
                        </h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Yorum yapmak ve bildirimleri almak için kayıt ol
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.general && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Ad
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border ${errors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]/50 transition-all text-slate-900 dark:text-slate-100`}
                                    placeholder="Adınız"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-500 font-medium">{errors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Soyad
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border ${errors.lastName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]/50 transition-all text-slate-900 dark:text-slate-100`}
                                    placeholder="Soyadınız"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-500 font-medium">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kullanıcı Adı
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border ${errors.username ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]/50 transition-all text-slate-900 dark:text-slate-100`}
                                    placeholder="kullanici_adi"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-500 font-medium">{errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                E-posta
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]/50 transition-all text-slate-900 dark:text-slate-100`}
                                    placeholder="ornek@email.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Şifre
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]/50 transition-all text-slate-900 dark:text-slate-100`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Şifre Tekrar
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]/50 transition-all text-slate-900 dark:text-slate-100`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500 font-medium">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Email Notifications Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                {formData.emailNotificationsEnabled ? (
                                    <Bell className="w-5 h-5 text-[#EA580C]" />
                                ) : (
                                    <BellOff className="w-5 h-5 text-slate-400" />
                                )}
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                        E-posta Bildirimleri
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Yeni blog yazıları için bildirim al
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="emailNotificationsEnabled"
                                    checked={formData.emailNotificationsEnabled}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20 dark:peer-focus:ring-orange-500/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#EA580C]"></div>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white font-black rounded-xl hover:shadow-xl hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Kayıt yapılıyor...
                                </span>
                            ) : (
                                'Kayıt Ol'
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-slate-600 dark:text-slate-400">
                            Zaten hesabın var mı?{' '}
                            <Link to="/login" className="text-[#EA580C] hover:text-[#FBBF24] font-bold">
                                Giriş Yap
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
