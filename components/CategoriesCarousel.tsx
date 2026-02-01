'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
    name: string;
    icon: React.ReactNode;
    color: string;
}

export default function CategoriesCarousel({ categories }: { categories: Category[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleItems(1);
            else if (window.innerWidth < 1024) setVisibleItems(2);
            else setVisibleItems(4);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (categories.length - visibleItems + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? 0 : prev - 1));
    };

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = categories.length - visibleItems;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, [categories.length, visibleItems]);

    return (
        <div className="relative group px-4 md:px-12">
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-amber-600 hover:scale-110 transition-all z-10 disabled:opacity-50"
                disabled={currentIndex === 0}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="overflow-hidden py-4 -my-4">
                <motion.div
                    className="flex gap-6"
                    animate={{ x: `calc(-${currentIndex * (100 / visibleItems)}% - ${currentIndex * 1.5}rem)` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {categories.map((cat) => (
                        <div
                            key={cat.name}
                            style={{ minWidth: `calc((100% - ${(visibleItems - 1) * 1.5}rem) / ${visibleItems})` }}
                            className="shrink-0"
                        >
                            <Link
                                href={`/projects?category=${cat.name}`}
                                className="block h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-amber-200 transition-all group duration-300 flex flex-col items-center text-center"
                            >
                                <div className={`mb-6 p-4 rounded-full bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all ${cat.color}`}>{cat.icon}</div>
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">{cat.name}</h3>
                            </Link>
                        </div>
                    ))}
                </motion.div>
            </div>

            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-amber-600 hover:scale-110 transition-all z-10 disabled:opacity-50"
                disabled={currentIndex >= categories.length - visibleItems}
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}
