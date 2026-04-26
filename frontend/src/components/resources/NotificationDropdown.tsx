import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Clock } from 'lucide-react';

export interface NotificationDto {
    id: number;
    message: string;
    read: boolean;
    createdAt: string;
    relatedId?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8085';

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Helper for Auth Headers based on your Login.tsx logic
    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    });

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
                headers: getAuthHeaders(),
            });
            const result: ApiResponse<number> = await response.json();
            if (result.success) setUnreadCount(result.data);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: getAuthHeaders(),
            });
            const result: ApiResponse<NotificationDto[]> = await response.json();
            if (result.success) setNotifications(result.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    const toggleDropdown = () => {
        if (!isOpen) fetchNotifications();
        setIsOpen(!isOpen);
    };

    const markAsRead = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
            const result: ApiResponse<void> = await response.json();
            if (result.success) {
                setNotifications(prev => 
                    prev.map(n => n.id === id ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
            const result: ApiResponse<void> = await response.json();
            if (result.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className={`relative p-2 rounded-full transition-all ${
                    unreadCount > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                } hover:bg-indigo-100`}
            >
                <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-red-600 text-white text-[10px] font-bold rounded-full border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[350px] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center text-slate-400 text-xs">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-xs">No notifications yet</div>
                            ) : (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        className={`p-4 border-b border-slate-50 dark:border-slate-700/50 flex gap-3 transition-colors ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-relaxed ${!n.read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock size={12} className="text-slate-400" />
                                                <span className="text-[10px] text-slate-400">{formatTime(n.createdAt)}</span>
                                                {n.relatedId && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold uppercase">
                                                        #{n.relatedId}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {!n.read && (
                                            <button 
                                                onClick={() => markAsRead(n.id)}
                                                className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors shrink-0"
                                            >
                                                <Check size={14} strokeWidth={3} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

