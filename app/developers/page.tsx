'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { UserAvatar } from '@/components/UserAvatar';
import { User } from '@/lib/types';
import { Search, Filter, MapPin, Star, Sparkles, SlidersHorizontal, X, ArrowRight, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DevelopersPage() {
    const { users } = useApp();
    const developers = users.filter(u => u.role === 'developer');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [minSuccessRate, setMinSuccessRate] = useState<number>(0);

    // Get unique universities
    const universities = Array.from(new Set(developers.map(d => d.university).filter(Boolean))) as string[];

    const filteredDevelopers = developers.filter(dev => {
        const matchesSearch =
            dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dev.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dev.bio?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesUniversity = selectedUniversity ? dev.university === selectedUniversity : true;
        const matchesRate = dev.successRate ? dev.successRate >= minSuccessRate : minSuccessRate === 0;

        return matchesSearch && matchesUniversity && matchesRate;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedUniversity('');
        setMinSuccessRate(0);
    };

    const hasFilters = searchTerm || selectedUniversity || minSuccessRate > 0;

    const FilterSection = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-500" />
                    Filter Talent
                </h3>
                {hasFilters && (
                    <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider">
                        Clear All
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                            placeholder="Name or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* University */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">University</label>
                    <select
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-white"
                        value={selectedUniversity}
                        onChange={(e) => setSelectedUniversity(e.target.value)}
                    >
                        <option value="">All Universities</option>
                        {universities.map(uni => (
                            <option key={uni} value={uni}>{uni}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* Success Rate */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Success Rate</label>
                    <div className="space-y-2">
                        {[
                            { label: 'Any Success Rate', value: 0 },
                            { label: '90% & Up', value: 90 },
                            { label: '80% & Up', value: 80 },
                        ].map((option) => (
                            <label key={option.label} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${minSuccessRate === option.value ? 'border-amber-500' : 'border-slate-300 group-hover:border-amber-400'}`}>
                                    {minSuccessRate === option.value && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                                </div>
                                <input
                                    type="radio"
                                    name="successRate"
                                    className="hidden"
                                    checked={minSuccessRate === option.value}
                                    onChange={() => setMinSuccessRate(option.value)}
                                />
                                <span className={`text-sm ${minSuccessRate === option.value ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`}>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden sticky top-[72px] z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <span className="font-bold text-slate-900 border-b border-white">{filteredDevelopers.length} Experts Found</span>
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
                                    Show Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
                        Find Expert Developers
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
                        Connect with top student developers and researchers for your project.
                    </p>
                </div>

                <div className="flex gap-12 items-start">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 shrink-0 sticky top-32">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <FilterSection />
                        </div>
                    </div>

                    {/* Developers Grid */}
                    <div className="flex-1">
                        {filteredDevelopers.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredDevelopers.map((dev) => (
                                        <motion.div
                                            key={dev.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <DeveloperCard developer={dev} />
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
                                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                    🕵️
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                    No developers found
                                </h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                    Try adjusting your search terms to find more experts.
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

function DeveloperCard({ developer }: { developer: User }) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300 flex flex-col h-full relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <UserAvatar user={developer} className="w-16 h-16 text-2xl shadow-lg border-2 border-white" size="lg" />
                    <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {developer.successRate ? `${developer.successRate}%` : 'NEW'}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">{developer.name}</h3>
                    <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {developer.university || 'No University Listed'}
                    </div>
                </div>

                <p className="text-slate-600 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
                    {developer.bio || 'Experienced academic developer ready to take on complex projects.'}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:bg-amber-50/50 group-hover:border-amber-100 transition-colors">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Projects</div>
                        <div className="font-bold text-slate-900">{developer.acceptedProposals || 0}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:bg-amber-50/50 group-hover:border-amber-100 transition-colors">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Earnings</div>
                        <div className="font-bold text-slate-900 font-mono">GH₵{developer.totalEarnings?.toLocaleString() || '0'}</div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <Link href={`/profile/${developer.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-white border-slate-200 hover:border-slate-300 text-slate-600">
                        Profile
                    </Button>
                </Link>
                <Button className="flex-1 bg-slate-900 text-white hover:bg-amber-600 border-none shadow-lg shadow-amber-900/10 transition-all">
                    Invite <Sparkles className="w-4 h-4 ml-2 opacity-50" />
                </Button>
            </div>
        </div>
    );
}
