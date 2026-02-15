'use client';

import { useApp } from '@/contexts/AppContext';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle, MoreHorizontal, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyJobsPage() {
    const router = useRouter();
    const { currentUser, projects, tasks } = useApp();

    useEffect(() => {
        if (!currentUser) router.push('/login');
    }, [currentUser, router]);

    if (!currentUser) return null;

    // Derived State based on Role
    const myProjects = currentUser.role === 'client'
        ? projects.filter(p => p.clientId === currentUser.id)
        : [];

    const myTasks = currentUser.role === 'developer'
        ? tasks.filter(t => t.assigneeId === currentUser.id)
        : [];

    return (
        <div className="min-h-screen bg-slate-50">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-900">
                        {currentUser.role === 'client' ? 'My Project Requests' : 'My Assigned Tasks'}
                    </h1>
                    {currentUser.role === 'client' && (
                        <Link href="/projects/new">
                            <Button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-amber-500/20">
                                Start New Project
                            </Button>
                        </Link>
                    )}
                </div>

                {/* CLIENT VIEW: Projects */}
                {currentUser.role === 'client' && (
                    <section className="space-y-6">
                        {myProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myProjects.map(project => (
                                    <div key={project.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${project.status === 'active' ? 'bg-green-100 text-green-700' :
                                                project.status === 'requested' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {project.status}
                                            </span>
                                            <span className="font-mono font-bold text-slate-900">GH₵{project.budget}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">{project.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                                        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-4">
                                            <span>{project.category}</span>
                                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-200">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Projects</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't posted any projects yet. Start your journey with DownGigs today.</p>
                                <Link href="/projects/new">
                                    <Button variant="outline">Create Request</Button>
                                </Link>
                            </div>
                        )}
                    </section>
                )}

                {/* DEVELOPER VIEW: Tasks */}
                {currentUser.role === 'developer' && (
                    <section className="space-y-6">
                        {myTasks.length > 0 ? (
                            <div className="space-y-4">
                                {myTasks.map(task => (
                                    <div key={task.id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:border-amber-300 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-xl text-slate-900">{task.title}</h3>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded">{task.status}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-3 max-w-2xl">{task.description}</p>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                            <span className="text-2xl font-bold text-slate-900">GH₵{task.budgetPayout}</span>
                                            <Button size="sm" className="w-full bg-slate-900 text-white">View Details</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-200">
                                <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Task Board Empty</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    You have no assigned tasks. Keep your profile updated to increase your chances of selection by our Project Managers.
                                </p>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
