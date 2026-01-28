'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Simple utility for merging classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends HTMLMotionProps<"button"> { // Extend motion props
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {

        const variants = {
            primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30 border border-transparent font-bold tracking-wide',
            secondary: 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 hover:border-slate-700 shadow-sm',
            outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-600',
            ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs font-medium',
            md: 'px-5 py-2.5 text-sm font-medium',
            lg: 'px-8 py-4 text-base font-semibold',
            icon: 'h-10 w-10 p-2 flex items-center justify-center',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
