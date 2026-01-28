'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    user?: {
        name?: string;
        avatar?: string;
    };
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function UserAvatar({ user, className, size = 'md' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-20 h-20 text-xl'
    };

    const initials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?';

    // Generate a consistent color based on name
    const colors = [
        'bg-red-100 text-red-600',
        'bg-orange-100 text-orange-600',
        'bg-amber-100 text-amber-600',
        'bg-green-100 text-green-600',
        'bg-emerald-100 text-emerald-600',
        'bg-teal-100 text-teal-600',
        'bg-cyan-100 text-cyan-600',
        'bg-sky-100 text-sky-600',
        'bg-blue-100 text-blue-600',
        'bg-indigo-100 text-indigo-600',
        'bg-violet-100 text-violet-600',
        'bg-purple-100 text-purple-600',
        'bg-fuchsia-100 text-fuchsia-600',
        'bg-pink-100 text-pink-600',
        'bg-rose-100 text-rose-600',
    ];

    const colorIndex = user?.name ? user.name.length % colors.length : 0;
    const colorClass = colors[colorIndex];

    const isImage = user?.avatar && user.avatar.startsWith('http');

    return (
        <div
            className={cn(
                `${sizeClasses[size]} rounded-full flex items-center justify-center font-bold overflow-hidden border border-slate-100 shrink-0`,
                !isImage && colorClass,
                className
            )}
        >
            {isImage ? (
                <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
}
