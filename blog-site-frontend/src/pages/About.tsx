import { useState, useEffect, useRef } from 'react';
import { GraduationCap, Briefcase, Users, MapPin, Calendar, ChevronDown, ChevronUp, Loader2, Settings, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import Layout from '../components/layout/Layout';
import TechStack from '../components/ui/TechStack';
import axios from 'axios';

interface AboutData {
    education: any[];
    experience: any[];
    references: any[];
    stats: {
        yearsOfExperience: string;
        companyCount: number;
        technologyCount: number;
        referenceCount: number;
    };
}

const API_URL = 'http://localhost:8079/api/about';

type Tab = 'education' | 'experience' | 'references';

const About = () => {
    const [data, setData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('experience');
    const [expandedExp, setExpandedExp] = useState<string | null>(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<any>(null);
    const [modalType, setModalType] = useState<Tab | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;

        const controller = new AbortController();
        fetchAboutData(controller.signal);

        return () => {
            controller.abort();
        };
    }, []);

    const fetchAboutData = async (signal?: AbortSignal) => {
        try {
            const response = await axios.get(API_URL, { signal });
            if (response.data.success) {
                setData(response.data.data);
                hasFetched.current = true;
                // Expand first experience by default
                if (response.data.data.experience.length > 0) {
                    setExpandedExp(response.data.data.experience[0].id);
                }
            }
        } catch (error) {
            if (axios.isCancel(error)) return;
            console.error('Failed to fetch about data', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedExp(expandedExp === id ? null : id);
    };

    const toggleAdminMode = () => {
        setIsAdminMode(!isAdminMode);
    };

    const handleAdd = (type: Tab) => {
        setModalType(type);
        setModalData(type === 'experience' ? { technologies: [] } : {});
        setIsModalOpen(true);
    };

    const handleEdit = (type: Tab, item: any) => {
        setModalType(type);
        setModalData(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (type: Tab, id: string) => {
        if (!window.confirm('Emin misiniz?')) return;
        try {
            const endpoint = type === 'references' ? 'references' : type;
            await axios.delete(`${API_URL}/${endpoint}/${id}`);
            fetchAboutData();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = modalType === 'references' ? 'references' : modalType;
            if (modalData.id) {
                await axios.put(`${API_URL}/${endpoint}/${modalData.id}`, modalData);
            } else {
                await axios.post(`${API_URL}/${endpoint}`, modalData);
            }
            setIsModalOpen(false);
            fetchAboutData();
        } catch (error) {
            console.error('Submit failed', error);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-[#EA580C] animate-spin" />
                </div>
            </Layout>
        );
    }

    if (!data) return null;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="absolute top-0 right-0 z-20">
                    <button
                        onClick={toggleAdminMode}
                        className={`p-2.5 rounded-xl transition-all duration-300 border ${isAdminMode
                            ? 'bg-[#EA580C] text-white border-[#EA580C]/50 shadow-lg shadow-orange-500/30'
                            : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-[#EA580C] hover:text-[#EA580C] shadow-sm'
                            }`}
                        title={isAdminMode ? 'Yönetim Aktif' : 'Yönetim Modu'}
                    >
                        <Settings className={`w-5 h-5 ${isAdminMode ? 'animate-spin-slow' : ''}`} />
                    </button>
                </div>

                {/* Tech Stack Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-10">Tech Stack</h2>
                    <TechStack />
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="inline-flex bg-slate-100 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-inner">
                        <button
                            onClick={() => setActiveTab('education')}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'education'
                                ? 'bg-white dark:bg-slate-700 text-[#EA580C] dark:text-[#FBBF24] shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:text-[#EA580C] dark:hover:text-[#FBBF24]'
                                }`}
                        >
                            <GraduationCap className="w-5 h-5" />
                            Eğitim
                        </button>
                        <button
                            onClick={() => setActiveTab('experience')}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'experience'
                                ? 'bg-white dark:bg-slate-700 text-[#EA580C] dark:text-[#FBBF24] shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:text-[#EA580C] dark:hover:text-[#FBBF24]'
                                }`}
                        >
                            <Briefcase className="w-5 h-5" />
                            Deneyim
                        </button>
                        <button
                            onClick={() => setActiveTab('references')}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'references'
                                ? 'bg-white dark:bg-slate-700 text-[#EA580C] dark:text-[#FBBF24] shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:text-[#EA580C] dark:hover:text-[#FBBF24]'
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            Referanslar
                        </button>
                    </div>

                    {isAdminMode && (activeTab === 'experience' || activeTab === 'references') && (
                        <button
                            onClick={() => handleAdd(activeTab)}
                            className="p-4 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white rounded-2xl shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:scale-110"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {/* Education Tab */}
                    {activeTab === 'education' && (
                        <div className="grid gap-8">
                            {data.education.map((edu) => (
                                <div
                                    key={edu.id}
                                    className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex flex-col md:flex-row items-start gap-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#EA580C] to-[#FBBF24] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10">
                                            <GraduationCap className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 italic">
                                                    {edu.institution}
                                                </h3>
                                                {edu.status === 'Devam' && (
                                                    <span className="px-3 py-1 bg-orange-500/10 text-[#EA580C] text-xs font-bold rounded-full uppercase tracking-wider">
                                                        Devam Ediyor
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[#EA580C] dark:text-[#FBBF24] text-lg font-semibold mb-3">
                                                {edu.degree} - {edu.department}
                                            </p>
                                            <p className="text-slate-600 dark:text-slate-400 mb-4 opacity-80">
                                                {edu.faculty}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[#EA580C]" />
                                                    {edu.period}
                                                </span>
                                                {edu.gpa && (
                                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                                                        GNO: {edu.gpa}
                                                    </span>
                                                )}
                                            </div>
                                            {edu.thesis && (
                                                <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border-l-4 border-[#EA580C]">
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                        <span className="font-bold text-[#EA580C]">Tez Konusu:</span> {edu.thesis}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && (
                        <div className="relative space-y-8">
                            {/* Timeline line */}
                            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#EA580C] to-[#FBBF24] rounded-full hidden md:block opacity-20" />

                            {data.experience.map((exp) => (
                                <div
                                    key={exp.id}
                                    className="relative md:ml-16"
                                >
                                    {/* Timeline dot */}
                                    <div className={`absolute -left-12 top-8 w-6 h-6 rounded-full border-4 z-10 hidden md:block shadow-lg ${exp.isCurrent
                                        ? 'bg-[#EA580C] border-[#EA580C]/30 animate-pulse'
                                        : 'bg-slate-400 border-slate-200 dark:border-slate-700'
                                        }`} />

                                    <div className={`bg-white dark:bg-slate-800 rounded-3xl border transition-all duration-500 ${expandedExp === exp.id
                                        ? 'border-[#EA580C] ring-4 ring-[#EA580C]/10 shadow-2xl'
                                        : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg'
                                        }`}>
                                        <button
                                            onClick={() => toggleExpand(exp.id)}
                                            className="w-full p-8 text-left outline-none"
                                        >
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex items-start gap-6">
                                                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${exp.isCurrent
                                                        ? 'bg-gradient-to-br from-[#EA580C] to-[#FBBF24] shadow-orange-500/20'
                                                        : 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/20'
                                                        }`}>
                                                        <Briefcase className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 italic">
                                                                {exp.company}
                                                            </h3>
                                                            {exp.isCurrent && (
                                                                <span className="px-3 py-1 bg-orange-500/10 text-[#EA580C] text-xs font-bold rounded-full uppercase tracking-widest">
                                                                    Aktif
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[#EA580C] dark:text-[#FBBF24] text-lg font-bold">
                                                            {exp.title}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 font-medium">
                                                            <Calendar className="w-4 h-4 text-[#EA580C]" />
                                                            {exp.period}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isAdminMode && (
                                                        <div className="flex items-center gap-2 mr-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit('experience', exp);
                                                                }}
                                                                className="p-2.5 bg-[#EA580C]/10 text-[#EA580C] rounded-xl hover:bg-[#EA580C]/20 transition-colors"
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete('experience', exp.id);
                                                                }}
                                                                className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <div className={`p-2 rounded-full transition-colors ${expandedExp === exp.id ? 'bg-[#EA580C]/10' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                                                        {expandedExp === exp.id ? (
                                                            <ChevronUp className="w-6 h-6 text-[#EA580C]" />
                                                        ) : (
                                                            <ChevronDown className="w-6 h-6 text-slate-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        {expandedExp === exp.id && (
                                            <div className="px-8 pb-8 border-t border-slate-100 dark:border-slate-700 pt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                                {/* Technologies */}
                                                <div className="mb-8">
                                                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest">
                                                        Technologies
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2.5">
                                                        {exp.technologies.map((tech: string, i: number) => (
                                                            <span
                                                                key={i}
                                                                className="px-4 py-1.5 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#EA580C] transition-colors"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="mb-8">
                                                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest">
                                                        Detaylı Açıklama
                                                    </h4>
                                                    <div className="text-slate-600 dark:text-slate-400 text-base leading-relaxed opacity-90 prose prose-sm dark:prose-invert max-w-none">
                                                        {exp.description}
                                                    </div>
                                                </div>

                                                {/* Leave Reason */}
                                                {exp.leaveReason && (
                                                    <div className="p-5 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                                                        <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                                                            <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-[#EA580C]">Ayrılma Nedeni:</span> {exp.leaveReason}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* References Tab */}
                    {activeTab === 'references' && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.references.map((ref) => (
                                <div
                                    key={ref.id}
                                    className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-6 relative">
                                        {isAdminMode && (
                                            <div className="absolute top-0 right-0 flex gap-2">
                                                <button
                                                    onClick={() => handleEdit('references', ref)}
                                                    className="p-2 bg-[#EA580C]/10 text-[#EA580C] rounded-lg hover:bg-[#EA580C]/20 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete('references', ref.id)}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#EA580C] to-[#FBBF24] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-white font-black text-2xl tracking-tighter">
                                                {ref.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                                {ref.name}
                                            </h3>
                                            <p className="text-[#EA580C] dark:text-[#FBBF24] font-bold text-sm uppercase tracking-wide mb-3">
                                                {ref.currentTitle}
                                            </p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 mb-6 font-medium">
                                                <MapPin className="w-4 h-4 text-[#EA580C]" />
                                                {ref.currentCompany}
                                            </p>
                                            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Çalışılan Kurum</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ref.workedTogether}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">O Dönemdeki Görevi</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ref.roleWhenWorked}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dynamic Stats */}
                <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#EA580C] rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative bg-white dark:bg-slate-800/80 border border-orange-500/20 rounded-3xl p-8 text-center backdrop-blur-sm">
                            <div className="text-5xl font-black text-[#EA580C] mb-2 truncate px-2">{data.stats.yearsOfExperience}</div>
                            <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Yıl Deneyim</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#FBBF24] rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative bg-white dark:bg-slate-800/80 border border-yellow-500/20 rounded-3xl p-8 text-center backdrop-blur-sm">
                            <div className="text-5xl font-black text-[#FBBF24] mb-2">{data.stats.companyCount}</div>
                            <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Şirket Sayısı</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#EA580C] rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative bg-white dark:bg-slate-800/80 border border-orange-500/20 rounded-3xl p-8 text-center backdrop-blur-sm">
                            <div className="text-5xl font-black text-[#EA580C] mb-2">{data.stats.technologyCount}</div>
                            <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Teknoloji</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#FBBF24] rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative bg-white dark:bg-slate-800/80 border border-yellow-500/20 rounded-3xl p-8 text-center backdrop-blur-sm">
                            <div className="text-5xl font-black text-[#FBBF24] mb-2">{data.stats.referenceCount}</div>
                            <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Referans</div>
                        </div>
                    </div>
                </div>

                {/* Management Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                            <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {modalData?.id ? 'Düzenle' : 'Yeni Ekle'} - {modalType === 'experience' ? 'Deneyim' : 'Referans'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {modalType === 'experience' ? (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Şirket</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={modalData.company || ''}
                                                    onChange={e => setModalData({ ...modalData, company: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Pozisyon</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={modalData.title || ''}
                                                    onChange={e => setModalData({ ...modalData, title: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Dönem (Örn: Kas 2023 - Günümüz)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={modalData.period || ''}
                                                    onChange={e => setModalData({ ...modalData, period: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="flex items-end gap-3 pb-3">
                                                <input
                                                    type="checkbox"
                                                    id="isCurrent"
                                                    checked={modalData.isCurrent || false}
                                                    onChange={e => setModalData({ ...modalData, isCurrent: e.target.checked })}
                                                    className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                                />
                                                <label htmlFor="isCurrent" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Şu anda çalışıyorum</label>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Teknolojiler (Virgülle ayırın)</label>
                                            <input
                                                type="text"
                                                value={modalData.technologies?.join(', ') || ''}
                                                onChange={e => setModalData({ ...modalData, technologies: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="Java, Spring Boot, React..."
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Açıklama</label>
                                            <textarea
                                                rows={4}
                                                value={modalData.description || ''}
                                                onChange={e => setModalData({ ...modalData, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white resize-none"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">İsim Soyisim</label>
                                            <input
                                                type="text"
                                                required
                                                value={modalData.name || ''}
                                                onChange={e => setModalData({ ...modalData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Şu Anki Şirket</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={modalData.currentCompany || ''}
                                                    onChange={e => setModalData({ ...modalData, currentCompany: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Şu Anki Pozisyon</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={modalData.currentTitle || ''}
                                                    onChange={e => setModalData({ ...modalData, currentTitle: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Birlikte Çalışılan Kurum</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={modalData.workedTogether || ''}
                                                    onChange={e => setModalData({ ...modalData, workedTogether: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">O Dönemdeki Rolü</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={modalData.roleWhenWorked || ''}
                                                    onChange={e => setModalData({ ...modalData, roleWhenWorked: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Vazgeç
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-2.5 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-orange-500/30"
                                    >
                                        <Save className="w-5 h-5" />
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default About;
