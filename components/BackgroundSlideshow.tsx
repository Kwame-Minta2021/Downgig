'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundSlideshowProps {
    images: string[];
    duration?: number; // duration in seconds
}

export default function BackgroundSlideshow({ images, duration = 5 }: BackgroundSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, duration * 1000);

        return () => clearInterval(intervalId);
    }, [images.length, duration]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Image Layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                        style={{ backgroundImage: `url(${images[currentIndex]})` }}
                    />

                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-slate-950/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.5),transparent_60%)]" />
                    {/* Subtle Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
