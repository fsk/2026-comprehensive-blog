import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { NotificationService, getCurrentUser } from '../../services/api';
import type { Notification, CurrentUser } from '../../types';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);

        if (user) {
            fetchNotifications(user.id);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async (userId: string) => {
        try {
            const [notifs, count] = await Promise.all([
                NotificationService.getNotifications(userId),
                NotificationService.getUnreadCount(userId)
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        if (!currentUser) return;
        try {
            await NotificationService.markAsRead(notificationId, currentUser.id);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!currentUser) return;
        try {
            await NotificationService.markAllAsRead(currentUser.id);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    if (!currentUser) {
        return null; // Don't show bell if not logged in
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-pastel-blue transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pastel-red text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-pastel-red/30">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">Bildirimler</h3>
                        {notifications.some(n => !n.isRead) && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-pastel-blue hover:text-blue-400 font-bold flex items-center gap-1"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Hepsi Okundu
                            </button>
                        )}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Bell className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Henüz bildirim yok</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-slate-50 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${!notification.isRead ? 'bg-blue-50/30 dark:bg-pastel-blue/5' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            {notification.relatedPostSlug ? (
                                                <Link
                                                    to={`/posts/${notification.relatedPostSlug}`}
                                                    onClick={() => {
                                                        if (!notification.isRead) {
                                                            handleMarkAsRead(notification.id);
                                                        }
                                                        setIsOpen(false);
                                                    }}
                                                    className="block"
                                                >
                                                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                                                        {notification.message}
                                                    </p>
                                                </Link>
                                            ) : (
                                                <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                                                    {notification.message}
                                                </p>
                                            )}
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium uppercase tracking-wider">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                    locale: tr
                                                })}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="mt-1 p-1 text-slate-300 hover:text-pastel-blue transition-colors"
                                                title="Okundu işaretle"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
