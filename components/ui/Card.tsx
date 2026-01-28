'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from './Button';

interface CardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = true, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={hoverEffect ? { y: 0 } : undefined}
                whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                    'bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 overflow-hidden relative',
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = 'Card';

export { Card };
