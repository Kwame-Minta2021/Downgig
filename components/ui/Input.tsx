'use client';

import * as React from 'react';
import { cn } from './Button';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm',
                        error && 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500 font-medium ml-1 animate-in slide-in-from-left-1">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
