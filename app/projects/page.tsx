'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, FileText } from 'lucide-react';

export default function ProjectsPage() {
    const router = useRouter();
    const { currentUser, projects } = useApp();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Stub for developer view
    if (currentUser?.role === 'developer') {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Task Board</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        View tasks assigned to you by your Project Manager.
                    </p>
                    <div className="mt-12 p-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400">No active tasks assigned.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
                            My Project Requests
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
                            Track the status of your software development requests.
                        </p>
                    </div>
                    <Link href="/projects/new">
                        <Button className="bg-slate-900 text-white px-8 py-4 text-lg">
                            <Plus className="w-5 h-5 mr-2" /> New Request
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.filter(p => p.clientId === currentUser?.id).map(project => (
                        <div key={project.id}>
                            <ProjectCard project={project} />
                        </div>
                    ))}

                    {projects.filter(p => p.clientId === currentUser?.id).length === 0 && (
                        <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Requests Found</h3>
                            <p className="text-slate-500 mb-8">Ready to bring your idea to life?</p>
                            <Link href="/projects/new">
                                <Button variant="outline">Start New Request</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
