import { useState } from 'react';
import { Send, Bell, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Admin check
    const user = getCurrentUser();
    if (user?.role !== 'ADMIN') {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Yetkisiz Erişim</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekmektedir.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-8 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </Layout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuccess(true);
            setFormData({ subject: '', content: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            // setError('Duyuru gönderilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-gradient-to-br from-[#EA580C] to-[#FBBF24] rounded-2xl shadow-lg shadow-orange-500/20 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
                        <Bell className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">
                        Yeni Duyuru Oluştur
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        Tüm abonelerinize önemli güncellemeleri, haberleri ve duyuruları e-posta yoluyla anında iletin.
                    </p>
                </div>

                {/* Form Card */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FBBF24] rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="relative bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-700/50 shadow-2xl">

                        {success ? (
                            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Başarılı!</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
                                    Duyurunuz tüm abonelere başarıyla kuyruğa alındı ve gönderiliyor.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="px-8 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:scale-105 transition-transform"
                                >
                                    Yeni Duyuru Yap
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                        Duyuru Başlığı
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Örn: Yeni Blog Yazısı Yayında! 🚀"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-[#EA580C] focus:ring-4 focus:ring-[#EA580C]/10 outline-none transition-all font-bold text-lg text-slate-900 dark:text-slate-100 placeholder:font-medium placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                        Duyuru İçeriği
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            required
                                            rows={8}
                                            value={formData.content}
                                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="Abonelerinize iletmek istediğiniz mesajı buraya yazın..."
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-[#EA580C] focus:ring-4 focus:ring-[#EA580C]/10 outline-none transition-all text-slate-600 dark:text-slate-300 resize-none leading-relaxed"
                                        />
                                        <div className="absolute bottom-4 right-4">
                                            <Sparkles className="w-5 h-5 text-[#FBBF24]/50" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-between gap-4">
                                    <div className="text-sm text-slate-400 font-medium px-2">
                                        <span className="text-[#EA580C] font-bold">Not:</span> Bu işlem geri alınamaz.
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Herkese Gönder
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateAnnouncement;
