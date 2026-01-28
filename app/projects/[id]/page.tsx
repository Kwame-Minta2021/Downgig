'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { ChevronLeft, User, DollarSign, Clock, Calendar, Check, Send } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailsPage() {
    const params = useParams(); // { id: string }
    const router = useRouter();
    const { getProjectById, currentUser, submitProposal, acceptProposal, sendMessage } = useApp();

    // Parse ID safely
    const projectId = params?.id ? Number(params.id) : 0;
    const project = getProjectById(projectId);

    const [showProposalForm, setShowProposalForm] = useState(false);
    const [proposalData, setProposalData] = useState({
        coverLetter: '',
        amount: '',
        timeline: ''
    });

    // Redirect if not logged in (optional, access is protected per docs)
    useEffect(() => {
        if (!currentUser) router.push('/login');
    }, [currentUser, router]);

    if (!currentUser) return null;

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
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
    const hasProposed = project.proposals.some(p => p.developerId === currentUser.id);

    const handleSubmitProposal = (e: React.FormEvent) => {
        e.preventDefault();

        submitProposal({
            projectId: project.id,
            coverLetter: proposalData.coverLetter,
            amount: parseFloat(proposalData.amount),
            timeline: proposalData.timeline
        });

        setShowProposalForm(false);
        setProposalData({ coverLetter: '', amount: '', timeline: '' });
        // Minimal feedback, could be a toast
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAcceptProposal = (proposalId: number) => {
        if (confirm('Are you sure you want to accept this proposal? This will start the project.')) {
            acceptProposal(proposalId, project.id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

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
                                {project.status === 'in_progress' && (
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
                            {project.university && <span className="text-slate-500 ml-1">({project.university})</span>}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            Posted {project.createdAt}
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

                        {/* Proposals Section (Owner View) */}
                        {isOwner && project.proposals.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-serif font-bold text-slate-900 border-b pb-2 mb-4">
                                    Proposals ({project.proposals.length})
                                </h2>

                                {project.proposals.map((proposal) => (
                                    <div key={proposal.id} className={`card ${proposal.status === 'accepted' ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : 'hover:border-blue-300'} transition-all`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                    {proposal.developerAvatar}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900">{proposal.developerName}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Clock className="w-3 h-3" /> {proposal.timeline}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-slate-900">
                                                    GH₵{proposal.amount.toLocaleString()}
                                                </div>
                                                <span className={`badge badge-${proposal.status}`}>
                                                    {proposal.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 relative">
                                            {/* Quote icon effect */}
                                            <span className="absolute top-[-10px] left-4 text-3xl text-slate-300 bg-slate-50 px-1 leading-none">“</span>
                                            <p className="text-slate-700 italic leading-relaxed">{proposal.coverLetter}</p>
                                        </div>

                                        <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
                                            <button
                                                onClick={() => {
                                                    sendMessage(proposal.developerId, `Hi ${proposal.developerName}, I'm reviewing your proposal for "${project.title}".`);
                                                    router.push('/messages');
                                                }}
                                                className="btn btn-outline text-slate-600 border-slate-300 hover:text-blue-600 hover:border-blue-500 bg-white"
                                            >
                                                Send Message
                                            </button>

                                            {proposal.status === 'pending' && project.status === 'open' && (
                                                <button
                                                    onClick={() => handleAcceptProposal(proposal.id)}
                                                    className="btn btn-primary shadow-lg shadow-blue-500/20"
                                                >
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Hire & Start Contract
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Actions */}
                    <div className="lg:col-span-1">
                        {/* Developer Actions */}
                        {isDeveloper && !hasProposed && !showProposalForm && project.status === 'open' && (
                            <div className="sticky top-24">
                                <div className="card bg-blue-50 border-blue-100 shadow-xl shadow-blue-500/10">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">Interested in this project?</h3>
                                    <p className="text-blue-700 mb-6 text-sm">
                                        Submit a proposal to outline your approach and quote.
                                    </p>
                                    <button
                                        onClick={() => setShowProposalForm(true)}
                                        className="btn btn-primary w-full shadow-lg shadow-blue-500/30"
                                    >
                                        Submit Proposal
                                    </button>
                                </div>
                            </div>
                        )}

                        {hasProposed && (
                            <div className="sticky top-24">
                                <div className="card bg-emerald-50 border-emerald-100">
                                    <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                                        <Check className="w-5 h-5" /> Proposal Submitted
                                    </div>
                                    <p className="text-emerald-700 text-sm">
                                        You have applied for this project. The client will review your proposal shortly.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Project Closed */}
                        {project.status !== 'open' && (
                            <div className="sticky top-24">
                                <div className="card bg-slate-100 border-slate-200">
                                    <h3 className="font-bold text-slate-700 mb-1">Project Closed</h3>
                                    <p className="text-slate-500 text-sm">
                                        This project is {project.status.replace('_', ' ')}.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Proposal Form Overlay/Modal or Inline */}
                        {showProposalForm && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                        <h2 className="text-xl font-serif font-bold">Submit Proposal</h2>
                                        <button onClick={() => setShowProposalForm(false)} className="text-slate-400 hover:text-slate-600">
                                            <ChevronLeft className="w-6 h-6 rotate-180" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmitProposal} className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Cover Letter <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={proposalData.coverLetter}
                                                onChange={(e) => setProposalData({ ...proposalData, coverLetter: e.target.value })}
                                                className="input min-h-[150px]"
                                                placeholder="Explain why you are the best fit for this project..."
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    Your Bid (GH₵) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={proposalData.amount}
                                                    onChange={(e) => setProposalData({ ...proposalData, amount: e.target.value })}
                                                    className="input"
                                                    placeholder={project.budget.toString()}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    Timeline <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={proposalData.timeline}
                                                    onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
                                                    className="input"
                                                    placeholder="e.g., 2 weeks"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowProposalForm(false)}
                                                className="btn btn-outline flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary flex-1">
                                                <Send className="w-4 h-4 mr-2" />
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
