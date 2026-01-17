import { useState, useEffect } from 'react';
import {
    Twitter, Github, Linkedin, Instagram, Youtube,
    Plus, Trash2, Edit2, Save, X, Eye, EyeOff,
    ExternalLink, Hash, Type, Link as LinkIcon, Palette
} from 'lucide-react';
import { SocialMediaService } from '../services/api';
import type { SocialMedia } from '../types';
import { LeetCodeIcon, MediumIcon } from '../components/ui/BrandIcons';
import { useToast } from '../context/ToastContext';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const IconMap: Record<string, React.FC<{ className?: string }>> = {
    Twitter,
    Instagram,
    Github,
    Linkedin,
    Youtube,
    LeetCode: LeetCodeIcon,
    Medium: MediumIcon
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortableItem = ({ id, children }: { id: string; children: any }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

const SocialMediaAdmin = () => {
    const { showToast } = useToast();
    const [links, setLinks] = useState<SocialMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<SocialMedia>>({
        name: '',
        url: '',
        iconName: '',
        displayOrder: 1,
        isActive: true
    });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const data = await SocialMediaService.getAllSocialMedia();
            setLinks(data);
        } catch (error) {
            showToast('Social media links could not be loaded', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLinks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update displayOrder for all items locally
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    displayOrder: index + 1
                }));

                // Backend reorder is disabled/removed. Local reorder only.
                // try {
                //     const idList = updatedItems.map(item => item.id);
                //     await SocialMediaService.reorderSocialMedia(idList);
                // } catch (error) {
                //     console.error('Failed to reorder:', error);
                //     showToast('Sıralama güncellenemedi', 'error');
                // }

                return updatedItems;
            });
        }
    };

    const handleToggleActive = async (id: string) => {
        try {
            await SocialMediaService.toggleActiveStatus(id);
            setLinks(links.map(link =>
                link.id === id ? { ...link, isActive: !link.isActive } : link
            ));
            showToast('Status updated successfully', 'success');
        } catch (error) {
            showToast('Status could not be updated', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;
        try {
            await SocialMediaService.deleteSocialMedia(id);
            setLinks(links.filter(link => link.id !== id));
            showToast('Link deleted successfully', 'success');
        } catch (error) {
            showToast('Link could not be deleted', 'error');
        }
    };

    const handleEdit = (link: SocialMedia) => {
        setEditingId(link.id);
        setFormData(link);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            name: '',
            url: '',
            iconName: '',
            displayOrder: links.length + 1,
            isActive: true
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await SocialMediaService.updateSocialMedia(editingId, formData);
                setLinks(links.map(link => link.id === editingId ? updated : link));
                showToast('Link updated successfully', 'success');
            } else {
                const created = await SocialMediaService.createSocialMedia(formData);
                setLinks([...links, created].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
                showToast('Link created successfully', 'success');
            }
            handleCancelEdit();
        } catch (error) {
            showToast('Transaction failed', 'error');
        }
    };

    const PreviewIcon = formData.iconName ? (IconMap[formData.iconName] || null) : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 selection:bg-[#FBBF24]/30">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <Palette className="w-8 h-8 text-[#EA580C]" />
                            Sosyal Medya Yönetimi
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Platformları, linkleri ve ikonları buradan yönetebilirsin.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                {editingId ? <Edit2 className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-orange-500" />}
                                {editingId ? 'Link Düzenle' : 'Yeni Link Ekle'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Platform Adı</label>
                                    <div className="relative group">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Örn: Twitter"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 focus:border-[#EA580C] focus:ring-4 focus:ring-[#EA580C]/10 transition-all outline-none dark:text-white"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">İkon İsmi (IconMap Key)</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                            {PreviewIcon ? <PreviewIcon className="w-4 h-4 text-[#EA580C]" /> : <Palette className="w-4 h-4 text-slate-400" />}
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Örn: Twitter, Github, LeetCode"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 focus:border-[#EA580C] focus:ring-4 focus:ring-[#EA580C]/10 transition-all outline-none dark:text-white"
                                            value={formData.iconName}
                                            onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1 italic">
                                        Desteklenenler: Twitter, Instagram, Github, Linkedin, Youtube, LeetCode, Medium
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">URL</label>
                                    <div className="relative group">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://..."
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 focus:border-[#EA580C] focus:ring-4 focus:ring-[#EA580C]/10 transition-all outline-none dark:text-white"
                                            value={formData.url}
                                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Görünüm Sırası</label>
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#EA580C] transition-colors" />
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 focus:border-[#EA580C] focus:ring-4 focus:ring-[#EA580C]/10 transition-all outline-none dark:text-white"
                                            value={formData.displayOrder}
                                            onChange={e => setFormData({ ...formData, displayOrder: e.target.value === '' ? ('' as any) : parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white dark:text-slate-900 font-black py-3 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        {editingId ? 'Güncelle' : 'Ekle'}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-pastel-red transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
                                <p className="text-slate-400 font-bold">Linkler Yükleniyor...</p>
                            </div>
                        ) : links.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <Palette className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold">Henüz hiç sosyal medya linki eklenmemiş.</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={links}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-4">
                                        {links.map((link) => {
                                            const Icon = IconMap[link.iconName] || Twitter;
                                            return (
                                                <SortableItem key={link.id} id={link.id}>
                                                    <div
                                                        className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all group relative ${editingId === link.id ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'}`}
                                                    >
                                                        <div className="flex items-center justify-between gap-4 pb-4">
                                                            <div className="flex items-center gap-4">
                                                                {/* Drag Handle Indicator */}
                                                                <div className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-300">
                                                                    <Hash className="w-5 h-5" />
                                                                </div>
                                                                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${link.isActive ? 'border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'}`}>
                                                                    <Icon className="w-7 h-7" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{link.name}</h3>
                                                                        {!link.isActive && <span className="bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Gizli</span>}
                                                                    </div>
                                                                    <a
                                                                        href={link.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm text-slate-400 hover:text-orange-500 flex items-center gap-1 transition-colors truncate max-w-[200px] md:max-w-xs"
                                                                    >
                                                                        {link.url}
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                </div>
                                                            </div>

                                                            {/* Reorder Icons (Visual only for now, depends on displayOrder sorting) */}
                                                            <div className="flex items-center gap-2 mb-8">
                                                                <div className="flex flex-col gap-1 items-center justify-center px-3 border-l border-slate-100 dark:border-slate-800">
                                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sıra</span>
                                                                    <span className="text-xl font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 w-8 h-8 flex items-center justify-center rounded-lg">{link.displayOrder}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons - Fixed Bottom Right */}
                                                        <div className="absolute bottom-3 right-3 flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleToggleActive(link.id)}
                                                                className={`p-2 rounded-xl transition-all ${link.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 dark:bg-slate-800'} hover:scale-110 active:scale-95`}
                                                                title={link.isActive ? 'Linki Gizle' : 'Linki Göster'}
                                                                onPointerDown={(e) => e.stopPropagation()}
                                                            >
                                                                {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(link)}
                                                                className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-100 transition-all hover:scale-110 active:scale-95"
                                                                title="Düzenle"
                                                                onPointerDown={(e) => e.stopPropagation()}
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(link.id)}
                                                                className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-100 transition-all hover:scale-110 active:scale-95"
                                                                title="Sil"
                                                                onPointerDown={(e) => e.stopPropagation()}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </SortableItem>
                                            );
                                        })}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaAdmin;
