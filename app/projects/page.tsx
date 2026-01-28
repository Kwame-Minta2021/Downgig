'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import { FilterState } from '@/lib/types';
import { Search, Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
    const router = useRouter();
    const { projects } = useApp();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        level: '',
        category: '',
        budget: '',
        status: '',
    });

    const filteredProjects = projects.filter((project) => {
        if (filters.level && project.level !== filters.level) return false;
        if (filters.category && project.category !== filters.category) return false;
        if (filters.status && project.status !== filters.status) return false;

        if (filters.budget) {
            const [min, max] = filters.budget.split('-');
            const minBudget = parseInt(min);
            const maxBudget = max === '+' ? Infinity : parseInt(max);
            if (project.budget < minBudget || project.budget > maxBudget) return false;
        }

        return true;
    });

    const clearFilters = () => {
        setFilters({ level: '', category: '', budget: '', status: '' });
    };

    const hasFilters = Object.values(filters).some(Boolean);

    // Filter Section Component
    const FilterSection = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-500" />
                    Filter Projects
                </h3>
                {hasFilters && (
                    <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider">
                        Clear All
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Academic Level */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Level</label>
                    <div className="space-y-2">
                        {['Undergraduate', 'Masters', 'PhD', 'Professional'].map((level) => (
                            <label key={level} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.level === level ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-300 group-hover:border-amber-400'}`}>
                                    {filters.level === level && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <input
                                    type="radio"
                                    name="level"
                                    className="hidden"
                                    checked={filters.level === level}
                                    onChange={() => setFilters({ ...filters, level: filters.level === level ? '' : level })}
                                    onClick={() => filters.level === level && setFilters({ ...filters, level: '' })}
                                />
                                <span className={`text-sm ${filters.level === level ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`}>{level}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* Category */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-white"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="IoT">IoT</option>
                    </select>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* Budget */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget Range</label>
                    <div className="space-y-2">
                        {[
                            { label: 'Any Budget', value: '' },
                            { label: 'Under GH₵1,000', value: '0-1000' },
                            { label: 'GH₵1,000 - 5,000', value: '1000-5000' },
                            { label: 'GH₵5,000 - 10,000', value: '5000-10000' },
                            { label: 'Above GH₵10,000', value: '10000-+' }
                        ].map((option) => (
                            <label key={option.label} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${filters.budget === option.value ? 'border-amber-500' : 'border-slate-300 group-hover:border-amber-400'}`}>
                                    {filters.budget === option.value && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                                </div>
                                <input
                                    type="radio"
                                    name="budget"
                                    className="hidden"
                                    checked={filters.budget === option.value}
                                    onChange={() => setFilters({ ...filters, budget: option.value })}
                                />
                                <span className={`text-sm ${filters.budget === option.value ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`}>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* Status */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100 cursor-not-allowed opacity-75">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active Only
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden sticky top-[72px] z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <span className="font-bold text-slate-900 border-b border-white">{filteredProjects.length} Projects Found</span>
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
            </div>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/50 z-[100] backdrop-blur-sm lg:hidden"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold font-serif text-slate-900">Filters</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <FilterSection />
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50">
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
                                >
                                    Show {filteredProjects.length} Projects
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
                        Browse Academic Projects
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
                        Find exciting projects from students and researchers across top universities.
                    </p>
                </div>

                <div className="flex gap-12 items-start">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 shrink-0 sticky top-32">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <FilterSection />
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="flex-1">
                        {filteredProjects.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredProjects.map((project) => (
                                        <motion.div
                                            key={project.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ProjectCard project={project} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200"
                            >
                                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                    No projects match your filters
                                </h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                    Try adjusting your criteria to see more results
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-full font-bold hover:border-amber-500 hover:text-amber-600 transition-all shadow-sm hover:shadow-md"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
