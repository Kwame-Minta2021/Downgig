import Link from 'next/link';
import { Project } from '@/lib/types';
import { Card } from './ui/Card';
import { Clock, DollarSign, BookOpen, ChevronRight, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const { toggleSavedProject, currentUser } = useApp();
    const isSaved = currentUser?.savedProjectIds?.includes(project.id);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSavedProject(project.id);
    };

    return (
        <Link href={`/projects/${project.id}`}>
            <Card className="group cursor-pointer hover:border-amber-500/30 bg-white relative h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1">
                {/* Save Button */}
                {currentUser && (
                    <button
                        onClick={handleSave}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all z-20 ${isSaved
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm'
                            : 'bg-slate-100/50 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                )}

                {/* Subtle Amber Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-2xl" />

                <div className="flex justify-between items-start mb-4 pr-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getLevelBadgeStyle(project.level)}`}>
                                {project.level}
                            </span>
                            {project.urgent && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                                    <Zap className="w-3 h-3 fill-current" /> URGENT
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
                            {project.title}
                        </h3>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-5">
                    <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        {project.category}
                    </div>
                    <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        {project.timeline}
                    </div>
                </div>

                <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed flex-grow">
                    {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 group-hover:border-amber-100 transition-colors mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Budget</span>
                        <div className="flex items-center font-bold text-slate-900 text-lg">
                            <span className="text-emerald-600 mr-1">GH₵</span>
                            {project.budget.toLocaleString()}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 ml-2">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

function getLevelBadgeStyle(level: string) {
    switch (level.toLowerCase()) {
        case 'undergraduate': return 'bg-slate-100 text-slate-600 border-slate-200';
        case 'masters': return 'bg-slate-200 text-slate-700 border-slate-300';
        case 'phd': return 'bg-slate-800 text-white border-slate-900';
        case 'professional': return 'bg-amber-100 text-amber-800 border-amber-200';
        default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
}
