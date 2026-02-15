'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Project, User, Task } from '@/lib/types';
import { Plus, Check, Search, User as UserIcon, Calendar, DollarSign, X } from 'lucide-react';

export default function AdminPage() {
    const { currentUser, isLoading, projects, users, tasks, createTask, assignTask, updateUserStatus } = useApp();
    const router = useRouter();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Auth Check
    useEffect(() => {
        if (!isLoading) {
            if (!currentUser || currentUser.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [currentUser, isLoading, router]);

    if (isLoading || !currentUser) return null;

    const requestedProjects = projects.filter(p => p.status === 'requested');
    const developers = users.filter(u => u.role === 'developer');
    const pendingDevelopers = users.filter(u => u.role === 'developer' && u.status === 'pending');

    // Simple Task Creation Form
    const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedProject) return;
        const formData = new FormData(e.currentTarget);

        const taskData = {
            projectId: selectedProject.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            budgetPayout: Number(formData.get('budget')),
            status: 'open' as const,
            createdAt: new Date().toISOString()
        };

        const { error } = await createTask(taskData);
        if (!error) setIsTaskModalOpen(false);
    };

    // Assign Developer Helper
    const handleAssign = async (taskId: number, devId: string) => {
        await assignTask(taskId, devId);
    };

    const handleStatusUpdate = async (userId: string, status: User['status']) => {
        if (!confirm(`Are you sure you want to ${status} this user?`)) return;
        await updateUserStatus(userId, status);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Project Feed */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold font-serif text-slate-900">New Requests ({requestedProjects.length})</h2>
                    <h2 className="text-xl font-bold font-serif text-slate-900">New Requests ({requestedProjects.length})</h2>
                    <div className="space-y-4">
                        {pendingDevelopers.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> Pending Approvals ({pendingDevelopers.length})
                                </h3>
                                <div className="space-y-3">
                                    {pendingDevelopers.map(dev => (
                                        <div key={dev.id} className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{dev.name}</div>
                                                    <div className="text-xs text-slate-500">{dev.email}</div>
                                                </div>
                                                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{dev.university}</span>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(dev.id, 'approved')}
                                                    className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(dev.id, 'rejected')}
                                                    className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {requestedProjects.map(p => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProject(p)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedProject?.id === p.id ? 'bg-amber-50 border-amber-500 shadow-md' : 'bg-white border-slate-200 hover:border-amber-300'}`}
                            >
                                <span className="text-xs font-bold text-slate-400 uppercase">{p.category}</span>
                                <h3 className="font-bold text-slate-900">{p.title}</h3>
                                <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
                                    <span>{p.level}</span>
                                    <span className="font-mono">GH₵{p.budget}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Workspace (Scoping) */}
                <div className="lg:col-span-2">
                    {selectedProject ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-serif font-bold text-slate-900">{selectedProject.title}</h1>
                                    <p className="text-slate-500 mt-1">Client: {selectedProject.clientName || 'Masked Client'}</p>
                                </div>
                                <div className="space-x-2">
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">{selectedProject.status}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <span className="block text-slate-400 font-bold text-xs uppercase mb-1">Budget</span>
                                    <span className="text-lg font-bold text-slate-900">GH₵{selectedProject.budget}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <span className="block text-slate-400 font-bold text-xs uppercase mb-1">Timeline</span>
                                    <span className="text-lg font-bold text-slate-900">{selectedProject.timeline}</span>
                                </div>
                            </div>

                            <div className="prose max-w-none mb-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Requirements</h3>
                                <p className="text-slate-600 whitespace-pre-wrap">{selectedProject.requirements}</p>
                            </div>

                            <div className="border-t border-slate-100 pt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold font-serif text-slate-900">Project Tasks</h2>
                                    <Button onClick={() => setIsTaskModalOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Task
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {tasks.filter(t => t.projectId === selectedProject.id).length === 0 ? (
                                        <p className="text-slate-400 italic">No tasks created yet. Break this project down!</p>
                                    ) : (
                                        tasks.filter(t => t.projectId === selectedProject.id).map(t => (
                                            <div key={t.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-slate-50">
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{t.title}</h4>
                                                    <p className="text-xs text-slate-500">Payout: GH₵{t.budgetPayout}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {t.assigneeId ? (
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                            <Check className="w-3 h-3" /> Assigned
                                                        </div>
                                                    ) : (
                                                        <select
                                                            className="text-sm border border-slate-300 rounded-lg p-2 bg-white"
                                                            onChange={(e) => handleAssign(t.id, e.target.value)}
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>Assign Dev...</option>
                                                            {developers.map(d => (
                                                                <option key={d.id} value={d.id}>{d.name} ({d.internal_rating || 'N/A'})</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white p-12">
                            Select a request to start scoping
                        </div>
                    )}
                </div>
            </main>

            {/* Task Creation Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Create New Task</h3>
                            <button onClick={() => setIsTaskModalOpen(false)}><X className="w-6 h-6 text-slate-400 hover:text-slate-900" /></button>
                        </div>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Task Title</label>
                                <input name="title" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. Build Login API" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Payout (GH₵)</label>
                                <input name="budget" type="number" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Instructions</label>
                                <textarea name="description" required rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Detailed technical requirements..." />
                            </div>
                            <Button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl">Create Task</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
