'use client';

import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle, MoreHorizontal, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyJobsPage() {
    const router = useRouter();
    const { currentUser, contracts } = useApp();

    useEffect(() => {
        if (!currentUser) router.push('/login');
    }, [currentUser, router]);

    if (!currentUser) return null;

    // Filter contracts involving the current user
    const myContracts = contracts.filter(c =>
        c.clientId === currentUser.id || c.developerId === currentUser.id
    );

    const activeContracts = myContracts.filter(c => c.status === 'active');
    const completedContracts = myContracts.filter(c => c.status === 'completed');

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-900">My Jobs</h1>
                    {currentUser.role === 'client' && (
                        <Link href="/projects/new">
                            <Button variant="primary" className="shadow-lg shadow-blue-500/20">
                                Post New Job
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Active Contracts Section */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Active Contracts ({activeContracts.length})
                    </h2>

                    {activeContracts.length > 0 ? (
                        <div className="space-y-4">
                            {activeContracts.map(contract => (
                                <Card key={contract.id} className="flex flex-col md:flex-row justify-between items-center gap-6 border-l-4 border-l-green-500">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                                            {contract.projectTitle}
                                        </h3>
                                        <div className="text-sm text-slate-500 mb-2">
                                            Hired {new Date(contract.startDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-600">
                                                {currentUser.role === 'client' ? 'Developer:' : 'Client:'}
                                            </span>
                                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                                <span className="text-sm font-bold text-slate-800">
                                                    {currentUser.role === 'client' ? contract.developerName : contract.clientName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 w-full md:w-auto mt-4 md:mt-0">
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</div>
                                            <div className="text-xl font-bold text-slate-900">GH₵{contract.amount.toLocaleString()}</div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            <Button variant="secondary" size="sm" className="w-full">
                                                <MessageSquare className="w-4 h-4 mr-2" /> Message
                                            </Button>
                                            <Button variant="primary" size="sm" className="w-full">
                                                View Contract
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">No active jobs</h3>
                            <p className="text-slate-500 mb-6">
                                {currentUser.role === 'client'
                                    ? "You haven't hired anyone yet. Post a job to get started!"
                                    : "You don't have any active contracts. Browsing projects to find work."}
                            </p>
                            <Link href={currentUser.role === 'client' ? '/projects/new' : '/projects'}>
                                <Button variant="outline">
                                    {currentUser.role === 'client' ? 'Post a Job' : 'Browse Projects'}
                                </Button>
                            </Link>
                        </div>
                    )}
                </section>

                {/* Completed Contracts History */}
                {completedContracts.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            History
                        </h2>
                        <div className="space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                            {completedContracts.map(contract => (
                                <div key={contract.id} className="bg-white p-6 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{contract.projectTitle}</h3>
                                        <p className="text-sm text-slate-500">Completed on {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <span className="badge badge-completed">Amt: GH₵{contract.amount}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
