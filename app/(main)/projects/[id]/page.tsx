'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

import { ChevronLeft, User, DollarSign, Clock, Calendar, Check, Send } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailsPage() {
    const params = useParams(); // { id: string }
    const router = useRouter();
    const { getProjectById, currentUser, sendMessage } = useApp();
    const [fundingLoading, setFundingLoading] = useState(false);

    // Import action dynamically/directly might be tricky in client component if it's not passed down. 
    // We should import from actions file.
    // However, imports are at top. I need to add import too.

    // ... imports logic inside the replacement content isn't possible if I'm targeting inside function.
    // I will stick to adding state here and assuming I'll add import in next step or use require if needed (bad practice).
    // Actually, I can replace the import line separately.

    // Let's just add the state and handler here.

    const handleFundProject = async () => {
        if (!project || !currentUser) return;

        // Confirm
        if (!confirm(`Are you sure you want to transfer GH₵${project.budget.toLocaleString()} from your wallet to this project's escrow?`)) return;

        setFundingLoading(true);
        // We need to import this. I will assume it's imported or I will add the import in a separate step.
        // Since I can't add the import line in this block easily without hitting top of file...
        // I'll use a dynamic import for now or just add the import in a separate tool call.
        const { fundProject } = await import('@/actions/payment');

        const result = await fundProject(project.id, project.budget);

        if (result.error) {
            alert(result.error);
        } else {
            alert('Project funded successfully!');
            // Refresh page or context
            window.location.reload();
        }
        setFundingLoading(false);
    };

    // Parse ID safely
    const projectId = params?.id ? Number(params.id) : 0;
    const project = getProjectById(projectId);

    // Redirect if not logged in (optional, access is protected per docs)
    useEffect(() => {
        if (!currentUser) router.push('/login');
    }, [currentUser, router]);

    if (!currentUser) return null;

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-50">

                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="text-6xl mb-6">🔍</div>
                    <h1 className="text-3xl font-bold mb-4 text-slate-900">Project Not Found</h1>
                    <p className="text-slate-600 mb-8">This project may have been removed or does not exist.</p>
                    <Link href="/projects" className="btn btn-primary">
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = currentUser.id === project.clientId;
    const isDeveloper = currentUser.role === 'developer';

    return (
        <div className="min-h-screen bg-slate-50">


            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link href="/projects" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Projects
                </Link>

                {/* Project Header */}
                <div className="card mb-8 border-t-4 border-t-blue-600">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3 leading-tight">{project.title}</h1>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`badge badge-${project.level.toLowerCase()}`}>
                                    {project.level}
                                </span>
                                <span className="text-slate-600 font-medium px-2 flex items-center bg-slate-100 rounded text-sm">
                                    {project.category}
                                </span>
                                {project.urgent && <span className="badge badge-urgent">URGENT</span>}
                                {project.status === 'active' && (
                                    <span className="badge bg-blue-100 text-blue-800 border-blue-200">IN PROGRESS</span>
                                )}
                                {project.status === 'completed' && (
                                    <span className="badge badge-completed">COMPLETED</span>
                                )}
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Budget</div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                GH₵{project.budget.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-600 border-t border-slate-100 pt-4">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-slate-400" />
                            Posted by <span className="font-bold text-slate-900 ml-1">{project.clientName}</span>
                            {/* project.university removed if not in type */}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            Posted {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            Est. {project.timeline}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <span className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg">📝</span>
                                Project Description
                            </h2>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                                {project.description}
                            </p>
                        </div>

                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <span className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center mr-3 text-lg">⚙️</span>
                                Technical Requirements
                            </h2>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                {project.requirements}
                            </p>
                        </div>

                        <div className="card">
                            <h2 className="text-xl font-bold mb-4">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill, index) => (
                                    <span key={index} className="tag text-base py-1.5 px-3">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="lg:col-span-1">
                        {/* Developer Actions - Managed Network Notice */}
                        {isDeveloper && (
                            <div className="sticky top-24">
                                <div className="card bg-blue-50 border-blue-100 shadow-xl shadow-blue-500/10">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">Interested?</h3>
                                    <p className="text-blue-700 mb-4 text-sm">
                                        This is a managed project. Our Project Managers review all profiles and assign tasks directly to the best-fit developers.
                                    </p>
                                    <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider">
                                        <Check className="w-4 h-4" /> No Bidding Required
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Owner Actions */}
                        {isOwner && (
                            <div className="sticky top-24 space-y-6">
                                <div className="card bg-slate-50 border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-2">Project Management</h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Your project manager is currently reviewing candidates. You will be notified when development begins.
                                    </p>
                                    <Link href="/messages">
                                        <button className="btn btn-outline w-full bg-white">
                                            Contact Support
                                        </button>
                                    </Link>
                                </div>

                                {/* FUNDING CARD */}
                                <div className="card bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                                        Project Funding
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Total Budget</span>
                                            <span className="font-bold text-slate-900">GH₵{project.budget.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Escrow Balance</span>
                                            <span className={`font-bold ${project.escrowBalance && project.escrowBalance >= project.budget ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                GH₵{(project.escrowBalance || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-1000 ${project.escrowBalance && project.escrowBalance >= project.budget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                style={{ width: `${Math.min(100, ((project.escrowBalance || 0) / project.budget) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {(!project.escrowBalance || project.escrowBalance < project.budget) ? (
                                        <button
                                            onClick={handleFundProject}
                                            disabled={fundingLoading}
                                            className="btn btn-primary w-full shadow-lg shadow-blue-500/20"
                                        >
                                            {fundingLoading ? 'Processing...' : 'Fund Project Now'}
                                        </button>
                                    ) : (
                                        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-sm flex items-center justify-center gap-2 font-bold border border-emerald-100">
                                            <Check className="w-5 h-5 bg-emerald-200 rounded-full p-0.5" />
                                            Fully Funded
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
