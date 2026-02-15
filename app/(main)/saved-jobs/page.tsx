'use client';

import { useApp } from '@/contexts/AppContext';

import ProjectCard from '@/components/ProjectCard'; // We'll update this next
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SavedJobsPage() {
    const router = useRouter();
    const { currentUser, projects } = useApp();

    useEffect(() => {
        if (!currentUser) router.push('/login');
    }, [currentUser, router]);

    if (!currentUser) return null;

    const savedIds = currentUser.savedProjectIds || [];
    const savedProjects = projects.filter(p => savedIds.includes(p.id));

    return (
        <div className="min-h-screen bg-slate-50">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8 flex items-center">
                    <Heart className="w-8 h-8 text-pink-500 mr-3 fill-pink-500" />
                    Saved Jobs
                </h1>

                {savedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="text-6xl mb-4">💔</div>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">No saved jobs yet</h2>
                        <p className="text-slate-500 mb-6">Bookmark jobs that interest you to apply later.</p>
                        <Link href="/projects">
                            <Button variant="primary">Browse Jobs</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
