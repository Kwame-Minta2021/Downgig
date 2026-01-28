import React from 'react';

export default function Logo({ className = "w-8 h-8", textClassName = "text-xl" }: { className?: string, textClassName?: string }) {
    return (
        <div className="flex items-center gap-2">
            <svg
                className={className}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width="40" height="40" rx="12" className="fill-amber-500" />
                <path
                    d="M20 10V30M20 30L12 22M20 30L28 22"
                    stroke="#0f172a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className={`font-bold tracking-tight text-slate-900 ${textClassName}`}>
                Down<span className="text-amber-500">Gigs</span>
            </span>
        </div>
    );
}
