import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { AuthService } from '../services/api';
import Layout from '../components/layout/Layout';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('E-posta adresiniz doğrulanıyor...');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Doğrulama bağlantısı geçersiz veya eksik.');
                return;
            }

            try {
                await AuthService.verifyEmail(token);
                setStatus('success');
                setMessage('E-posta adresiniz başarıyla doğrulandı!');
                // Optional: Auto redirect
                // setTimeout(() => navigate('/login'), 3000);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'Doğrulama işlemi başarısız oldu. Bağlantı süresi dolmuş olabilir.');
            }
        };

        verify();
    }, [token]);

    return (
        <Layout>
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center">

                    {status === 'verifying' && (
                        <>
                            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Doğrulanıyor</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                {message}
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Başarılı!</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                {message} Artık giriş yapabilirsiniz.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block w-full py-3 bg-[#EA580C] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Giriş Yap
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hata</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                {message}
                            </p>
                            <div className="flex gap-3">
                                <Link
                                    to="/"
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Ana Sayfa
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex-1 py-3 bg-[#EA580C] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Tekrar Kayıt Ol
                                </Link>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </Layout>
    );
};

export default VerifyEmail;
