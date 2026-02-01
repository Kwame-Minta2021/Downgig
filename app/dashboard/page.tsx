'use client';

import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, CheckCircle, Clock, DollarSign, Star, User, Plus, Search, Users, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ProjectCard from '@/components/ProjectCard';

// Deprecated Dashboards Removed for Managed View

export default function DashboardPage() {
    const { currentUser, isLoading, projects, tasks } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push('/login');
        }
    }, [currentUser, isLoading, router]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div>;
    if (!currentUser) return null;

    // Filter projects based on role logic
    const displayedProjects = currentUser.role === 'client'
        ? projects.filter(p => p.clientId === currentUser.id)
        : []; // Developers see TASKS, not projects directly (future impl)

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome, {currentUser.name}</h1>
                    <p className="text-slate-500">
                        {currentUser.role === 'client'
                            ? 'Manage your project requests and track progress.'
                            : 'Access your assigned tasks and work center.'}
                    </p>
                </div>

                {currentUser.role === 'client' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Your Project Requests</h2>
                            <Link href="/projects/new">
                                <Button>New Request</Button>
                            </Link>
                        </div>

                        {displayedProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayedProjects.map(p => (
                                    <ProjectCard key={p.id} project={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500 mb-4">You haven't submitted any projects yet.</p>
                                <Link href="/projects/new"><Button variant="outline">Start a Project</Button></Link>
                            </div>
                        )}
                    </div>
                )}

                {currentUser.role === 'developer' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Assigned Tasks ({tasks.length})</h2>
                        </div>
                        {tasks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tasks.map(task => (
                                    <div key={task.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                {task.status}
                                            </span>
                                            <span className="text-sm font-mono font-bold text-slate-900">GH₵{task.budgetPayout}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">{task.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                                        <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                            <span className="text-2xl font-bold text-slate-900">GH₵{task.budgetPayout}</span>
                                            <Link href={`/dashboard/tasks/${task.id}`}>
                                                <Button size="sm" className="w-full bg-slate-900 text-white">View Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                                <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Task Board Empty</h2>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    You have no active tasks at the moment. You will be notified when a Project Manager assigns work to you.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
