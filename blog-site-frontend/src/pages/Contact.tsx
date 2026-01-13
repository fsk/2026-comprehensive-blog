import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, User, CheckCircle2, Loader2, Lock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getCurrentUser } from '../services/api';

const Contact = () => {
    const user = getCurrentUser();
    const [formData, setFormData] = useState({
        name: user?.fullName || '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    if (!user) {
        return (
            <Layout>
                <div className="min-h-[70vh] flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <Lock className="w-10 h-10 text-slate-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Erişim Kısıtlı
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Benimle iletişime geçebilmek için sisteme kayıtlı olmanız gerekmektedir.
                            Bu uygulama güvenliği ve spamı önlemek amacıyla alınmış bir önlemdir.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/register"
                                className="flex-1 px-6 py-3 bg-[#EA580C] text-white font-bold rounded-2xl hover:bg-[#FBBF24] transition-all shadow-lg shadow-orange-500/25"
                            >
                                Kayıt Ol
                            </Link>
                            <Link
                                to="/login"
                                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulating API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ ...formData, subject: '', message: '' });
        }, 1500);
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
                        İletişime Geç
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                        Aşağıdaki formu doldurarak bana mesajınızı iletebilirsiniz. En kısa sürede size dönüş yapacağım.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                    {status === 'success' ? (
                        <div className="py-12 text-center animate-in zoom-in-95 duration-500">
                            <div className="mx-auto w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-8">
                                <CheckCircle2 className="w-12 h-12 text-[#EA580C]" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Mesajınız İletildi!</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
                                Mesajınız başarıyla gönderildi. İlginiz için teşekkürler!
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="px-10 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
                            >
                                Yeni Mesaj Yaz
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">İsim Soyisim</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#EA580C] transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-[#EA580C]/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white"
                                            placeholder="Adınız Soyadınız"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">E-posta Adresi</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#EA580C] transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-[#EA580C]/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white"
                                            placeholder="ornek@mail.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Konu</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-[#EA580C]/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white"
                                    placeholder="Mesajınızın konusu nedir?"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Mesajınız</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-[#EA580C]/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white resize-none"
                                    placeholder="Buraya mesajınızı yazabilirsiniz..."
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-5 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white font-black text-lg rounded-[1.5rem] hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50 disabled:translate-y-0 active:scale-95"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-7 h-7 animate-spin" />
                                            <span>Gönderiliyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-6 h-6" />
                                            <span>Mesajı İlet</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
