'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Clock, AlertCircle, ChevronLeft, Send, ExternalLink } from 'lucide-react';

export default function TaskDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { currentUser, tasks, updateTask } = useApp();
    const [submissionLink, setSubmissionLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Find the task
    const task = tasks.find(t => t.id === Number(params.id));

    useEffect(() => {
        if (!currentUser) router.push('/login');
    }, [currentUser, router]);

    if (!currentUser || !task) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">

                <div className="flex-1 flex items-center justify-center">
                    <p>Loading task...</p>
                </div>
            </div>
        );
    }

    // Handlers
    const handleStartTask = async () => {
        await updateTask(task.id, { status: 'in_progress' });
    };

    const handleSubmitWork = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // ideally we'd save the link too, but schema might not have it yet. 
        // For now, we assume the description update or a separate field.
        // Let's just update status to qa_ready for the MVP flow.
        const { error } = await updateTask(task.id, { status: 'qa_ready' });
        setIsSubmitting(false);
        if (!error) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-amber-600" onClick={() => router.back()}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${task.status === 'open' ? 'bg-blue-100 text-blue-700' :
                                    task.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                                        task.status === 'qa_ready' ? 'bg-purple-100 text-purple-700' :
                                            task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-slate-100 text-slate-600'
                                    }`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span className="text-slate-400 text-sm">Created {new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">{task.title}</h1>
                        </div>

                        <Card className="p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Instructions</h3>
                            <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                                {task.description}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-6 bg-white border-amber-200 shadow-amber-500/10">
                            <div className="mb-6">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payout Budget</span>
                                <span className="text-3xl font-bold text-slate-900">GH₵{task.budgetPayout}</span>
                            </div>

                            {/* Action Buttons based on Status */}
                            {task.status === 'assigned' || task.status === 'open' ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">Ready to start working? Mark this task as active to let the PM know.</p>
                                    <Button onClick={handleStartTask} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">
                                        Start Working
                                    </Button>
                                </div>
                            ) : task.status === 'in_progress' ? (
                                <form onSubmit={handleSubmitWork} className="space-y-4">
                                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex gap-2">
                                        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>Task is active. Provide your submission URL below when done.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Submission URL (GitHub/Link)</label>
                                        <input
                                            required
                                            value={submissionLink}
                                            onChange={(e) => setSubmissionLink(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl">
                                        {isSubmitting ? 'Submitting...' : 'Submit for QA'}
                                    </Button>
                                </form>
                            ) : task.status === 'qa_ready' ? (
                                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-center">
                                    <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                    <h3 className="font-bold text-purple-900">In Review</h3>
                                    <p className="text-sm text-purple-700 mt-1">Our QA team is verifying your work. You'll be notified of any feedback.</p>
                                </div>
                            ) : (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <h3 className="font-bold text-emerald-900">Completed</h3>
                                    <p className="text-sm text-emerald-700 mt-1">Payment has been processed.</p>
                                </div>
                            )}
                        </Card>

                        {/* Resources Widget (Placeholder) */}
                        <Card className="p-6">
                            <h4 className="font-bold text-slate-900 mb-3 text-sm">Helpers</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2 hover:text-amber-600 cursor-pointer">
                                    <ExternalLink className="w-3 h-3" /> API Documentation
                                </li>
                                <li className="flex items-center gap-2 hover:text-amber-600 cursor-pointer">
                                    <ExternalLink className="w-3 h-3" /> Design System
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
