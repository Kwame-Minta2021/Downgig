'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    CreditCard,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    ChevronDown,
    MapPin,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import {
    getPendingDevelopers,
    getPendingProjects,
    getAllClients,
    getAllTransactions,
    updateUserStatus,
    updateProjectStatus,
    getAllMeetings
} from '@/actions/admin';
import { User, Transaction, Project, Meeting } from '@/lib/types';

interface AdminDashboardProps {
    initialStats: {
        totalVolume: number;
        clientCount: number;
        developerCount: number;
        pendingCount: number;
    };
}

export default function AdminDashboard({ initialStats }: AdminDashboardProps) {
    const router = useRouter();
    const { currentUser } = useApp();

    // Local State
    const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'projects' | 'clients' | 'transactions' | 'meetings'>('overview');

    // Pagination State
    const [page, setPage] = useState(1);
    const LIMIT = 10;
    const [totalCount, setTotalCount] = useState(0);

    // Data State
    const [stats, setStats] = useState(initialStats);
    const [pendingDevs, setPendingDevs] = useState<User[]>([]);
    const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<User[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    // Modal State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Tab specific loading states
    const [isTabLoading, setIsTabLoading] = useState(false);

    // Action Feedback
    const [actionLoading, setActionLoading] = useState<string | number | null>(null);

    // Initial Auth Check
    useEffect(() => {
        if (!currentUser) return;
        if (currentUser.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [currentUser, router]);

    // Reset page when tab changes
    const handleTabChange = (tab: 'overview' | 'pending' | 'projects' | 'clients' | 'transactions' | 'meetings') => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setPage(1);
            setTotalCount(0);
        }
    };

    // Fetch Data on Tab/Page Change
    useEffect(() => {
        if (activeTab === 'overview') return;

        const fetchData = async () => {
            setIsTabLoading(true);

            if (activeTab === 'pending') {
                const res = await getPendingDevelopers(); // Pagination removed for now in action, simpler
                if (res && !res.error) {
                    setPendingDevs(res.data as User[] || []);
                    setTotalCount(res.data?.length || 0);
                }
            } else if (activeTab === 'projects') {
                const res = await getPendingProjects();
                if (res && !res.error) {
                    setPendingProjects(res.data as Project[] || []);
                    setTotalCount(res.data?.length || 0);
                }
            } else if (activeTab === 'clients') {
                const res = await getAllClients();
                if (res && !res.error) {
                    setClients(res.data as User[] || []);
                    setTotalCount(res.data?.length || 0); // Corrected to use array length for now
                }
            } else if (activeTab === 'transactions') {
                const res = await getAllTransactions(); // Helper returns all for now
                if (res && !res.error) {
                    setTransactions(res.data || []);
                    setTotalCount(res.data?.length || 0);
                }
            } else if (activeTab === 'meetings') {
                const res = await getAllMeetings();
                if (res && !res.error) {
                    setMeetings(res.data as Meeting[] || []);
                    setTotalCount(res.data?.length || 0);
                }
            }

            setIsTabLoading(false);
        };

        fetchData();
    }, [activeTab, page]);

    const handleApproval = async (userId: string, approved: boolean) => {
        setActionLoading(userId);
        const status = approved ? 'approved' : 'rejected';

        const { error } = await updateUserStatus(userId, status);

        if (!error) {
            // Optimistic Update
            setPendingDevs(prev => prev.filter(u => u.id !== userId));
            setStats(prev => ({
                ...prev,
                pendingCount: Math.max(0, prev.pendingCount - 1),
                developerCount: approved ? prev.developerCount + 1 : prev.developerCount
            }));
            setTotalCount(prev => Math.max(0, prev - 1));
            if (selectedUser?.id === userId) setSelectedUser(null);
        }
        setActionLoading(null);
    };

    const handleProjectApproval = async (projectId: number, approved: boolean) => {
        setActionLoading(projectId);
        const status = approved ? 'open' : 'rejected';

        const { error } = await updateProjectStatus(projectId, status);

        if (!error) {
            setPendingProjects(prev => prev.filter(p => p.id !== projectId));
            setTotalCount(prev => Math.max(0, prev - 1));
        }
        setActionLoading(null);
    };

    const totalPages = Math.ceil(totalCount / LIMIT);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600">Platform overview and management</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => handleTabChange('overview')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => handleTabChange('pending')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'pending' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        Pending Users
                        {stats.pendingCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pendingCount}</span>
                        )}
                    </button>
                    <button
                        onClick={() => handleTabChange('projects')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        Pending Projects
                    </button>
                    <button
                        onClick={() => handleTabChange('clients')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'clients' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        Clients
                    </button>
                    <button
                        onClick={() => handleTabChange('transactions')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'transactions' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        Transactions
                    </button>
                    <button
                        onClick={() => handleTabChange('meetings')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'meetings' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        Meetings
                    </button>
                </div>
            </div>

            {/* Stats Grid - Always visible on Overview */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Volume</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">Total Transaction Volume</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">GH₵ {stats.totalVolume.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            {stats.pendingCount > 0 && (
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Action Needed</span>
                            )}
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">Pending Approvals</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pendingCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">Active Clients</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.clientCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Briefcase className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">Active Developers</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.developerCount}</p>
                    </div>
                </div>
            )}

            {/* Content Area */}
            {activeTab !== 'overview' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col relative">
                    {/* User Details Modal (Overlay) */}
                    {selectedUser && (
                        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-right duration-300">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{selectedUser.name}</h2>
                                        <p className="text-sm text-slate-500">Developer Profile Review</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApproval(selectedUser.id, true)}
                                        disabled={actionLoading === selectedUser.id}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleApproval(selectedUser.id, false)}
                                        disabled={actionLoading === selectedUser.id}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-3xl mx-auto space-y-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                            {selectedUser.avatar && selectedUser.avatar.startsWith('http') ? (
                                                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    {selectedUser.avatar || '👤'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h3>
                                            <p className="text-lg text-slate-600 font-medium">{selectedUser.headline || 'No headline provided'}</p>
                                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedUser.university || 'N/A'}</span>
                                                <span className="flex items-center gap-1">Signed up: {new Date(selectedUser.created_at || '').toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose max-w-none">
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">About</h4>
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedUser.bio || 'No bio provided.'}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <h4 className="font-bold text-slate-900 mb-2">Contact Information</h4>
                                            <ul className="space-y-2 text-sm text-slate-600">
                                                <li className="flex justify-between"><span>Email:</span> <span className="font-medium text-slate-900">{selectedUser.email}</span></li>
                                                <li className="flex justify-between"><span>Phone:</span> <span className="font-medium text-slate-900">{selectedUser.phone || 'N/A'}</span></li>
                                                <li className="flex justify-between"><span>LinkedIn:</span> <a href={selectedUser.linkedin} target="_blank" className="text-blue-600 hover:underline">{selectedUser.linkedin ? 'View Profile' : 'N/A'}</a></li>
                                                <li className="flex justify-between"><span>GitHub:</span> <a href={selectedUser.github} target="_blank" className="text-blue-600 hover:underline">{selectedUser.github ? 'View Profile' : 'N/A'}</a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-4">Portfolio Projects</h4>
                                        <div className="grid grid-cols-1 gap-6">
                                            {selectedUser.portfolio && selectedUser.portfolio.length > 0 ? (
                                                selectedUser.portfolio.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex gap-6 p-4 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
                                                        {item.imageUrls && item.imageUrls[0] && (
                                                            <div className="w-32 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                                <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h5 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h5>
                                                            <p className="text-slate-600 text-sm mb-2">{item.description}</p>
                                                            {item.link && (
                                                                <a href={item.link} target="_blank" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                                                    View Project <ChevronRight className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-500 italic">No portfolio items added.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isTabLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 h-64 flex-1">
                            <Loader2 className="animate-spin h-10 w-10 text-slate-900 mb-4" />
                            <p className="text-slate-500">Loading data...</p>
                        </div>
                    ) : (
                        <>
                            {/* Pending Approvals Table */}
                            {activeTab === 'pending' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="font-bold text-slate-800">Pending Developer Applications</h2>
                                    </div>
                                    {pendingDevs && pendingDevs.length > 0 ? (
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                                                        <th className="px-6 py-3 font-medium">Name</th>
                                                        <th className="px-6 py-3 font-medium">Headline</th>
                                                        <th className="px-6 py-3 font-medium">University</th>
                                                        <th className="px-6 py-3 font-medium">Signed Up</th>
                                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {pendingDevs.map(user => (
                                                        <tr
                                                            key={user.id}
                                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                                            onClick={() => setSelectedUser(user)}
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm overflow-hidden">
                                                                        {user.avatar?.startsWith('http') ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user.avatar || user.name.charAt(0))}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-slate-900 block group-hover:text-amber-600 transition-colors">{user.name}</span>
                                                                        <span className="text-xs text-slate-500 block">Click to view details</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{user.headline || '-'}</td>
                                                            <td className="px-6 py-4 text-slate-600">{user.university || 'N/A'}</td>
                                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                                {new Date(user.created_at || '').toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        onClick={() => handleApproval(user.id, true)}
                                                                        disabled={actionLoading === user.id}
                                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                        title="Approve"
                                                                    >
                                                                        <CheckCircle2 className="w-5 h-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleApproval(user.id, false)}
                                                                        disabled={actionLoading === user.id}
                                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Reject"
                                                                    >
                                                                        <XCircle className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center text-slate-500 flex-1">
                                            <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4 opacity-50" />
                                            <p className="font-medium">All caught up!</p>
                                            <p className="text-sm">No pending developer applications.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pending Projects Table */}
                            {activeTab === 'projects' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="font-bold text-slate-800">Pending Project Approvals</h2>
                                    </div>
                                    {pendingProjects && pendingProjects.length > 0 ? (
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                                                        <th className="px-6 py-3 font-medium">Title</th>
                                                        <th className="px-6 py-3 font-medium">Client</th>
                                                        <th className="px-6 py-3 font-medium">Budget</th>
                                                        <th className="px-6 py-3 font-medium">Category</th>
                                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {pendingProjects.map(proj => (
                                                        <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <span className="font-medium text-slate-900 block">{proj.title}</span>
                                                                <span className="text-xs text-slate-500 max-w-xs truncate block">{proj.description.substring(0, 50)}...</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600">{proj.clientName || 'Unknown'}</td>
                                                            <td className="px-6 py-4 font-bold text-green-600">GH₵ {proj.budget}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                                                                    {proj.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        onClick={() => handleProjectApproval(proj.id, true)}
                                                                        disabled={actionLoading === proj.id}
                                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                        title="Approve"
                                                                    >
                                                                        <CheckCircle2 className="w-5 h-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleProjectApproval(proj.id, false)}
                                                                        disabled={actionLoading === proj.id}
                                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Reject"
                                                                    >
                                                                        <XCircle className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center text-slate-500 flex-1">
                                            <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4 opacity-50" />
                                            <p className="font-medium">All caught up!</p>
                                            <p className="text-sm">No pending projects.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Clients List */}
                            {activeTab === 'clients' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="font-bold text-slate-800">Client Directory</h2>
                                    </div>
                                    {clients && clients.length > 0 ? (
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                                                        <th className="px-6 py-3 font-medium">Name</th>
                                                        <th className="px-6 py-3 font-medium">Email</th>
                                                        <th className="px-6 py-3 font-medium">University</th>
                                                        <th className="px-6 py-3 font-medium">Location</th>
                                                        <th className="px-6 py-3 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {clients.map(client => (
                                                        <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">
                                                                        {client.avatar || client.name.charAt(0)}
                                                                    </div>
                                                                    <span className="font-medium text-slate-900">{client.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600">{client.email}</td>
                                                            <td className="px-6 py-4 text-slate-600">{client.university || '-'}</td>
                                                            <td className="px-6 py-4 text-slate-600">{client.location || '-'}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${client.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                    client.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                                                    }`}>
                                                                    {client.status?.toUpperCase() || 'APPROVED'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 flex-1">No clients found.</div>
                                    )}
                                </div>
                            )}

                            {/* Transactions List */}
                            {activeTab === 'transactions' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="font-bold text-slate-800">All Transactions</h2>
                                    </div>
                                    {transactions && transactions.length > 0 ? (
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                                                        <th className="px-6 py-3 font-medium">Ref</th>
                                                        <th className="px-6 py-3 font-medium">User</th>
                                                        <th className="px-6 py-3 font-medium">Amount</th>
                                                        <th className="px-6 py-3 font-medium">Type</th>
                                                        <th className="px-6 py-3 font-medium">Status</th>
                                                        <th className="px-6 py-3 font-medium">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {transactions.map(tx => (
                                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                                                {tx.reference?.substring(0, 8)}...
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-slate-900">{tx.profiles?.name || 'Unknown'}</span>
                                                                    <span className="text-xs text-slate-500">{tx.profiles?.email}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                                GH₵ {tx.amount}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {tx.type.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`flex items-center gap-1.5 text-sm ${tx.status === 'completed' ? 'text-green-600' :
                                                                    tx.status === 'failed' ? 'text-red-600' : 'text-amber-600'
                                                                    }`}>
                                                                    {tx.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                                                    {tx.status === 'failed' && <XCircle className="w-4 h-4" />}
                                                                    {tx.status === 'pending' && <AlertCircle className="w-4 h-4" />}
                                                                    <span className="capitalize">{tx.status}</span>
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                                {new Date(tx.created_at).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 flex-1">No transactions found.</div>
                                    )}
                                </div>
                            )}

                            {/* Meetings List */}
                            {activeTab === 'meetings' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="font-bold text-slate-800">Scheduled Meetings</h2>
                                    </div>
                                    {meetings && meetings.length > 0 ? (
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                                                        <th className="px-6 py-3 font-medium">Topic</th>
                                                        <th className="px-6 py-3 font-medium">Host</th>
                                                        <th className="px-6 py-3 font-medium">Attendee</th>
                                                        <th className="px-6 py-3 font-medium">Time</th>
                                                        <th className="px-6 py-3 font-medium">Duration</th>
                                                        <th className="px-6 py-3 font-medium">Status</th>
                                                        <th className="px-6 py-3 font-medium text-right">Link</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {meetings.map(meeting => (
                                                        <tr key={meeting.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <span className="font-medium text-slate-900 block">{meeting.title}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                                                                        {(meeting as any).host?.avatar || (meeting as any).host?.name?.charAt(0) || '?'}
                                                                    </div>
                                                                    <span className="text-sm text-slate-700">{(meeting as any).host?.name || 'Unknown'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                                                                        {(meeting as any).attendee?.avatar || (meeting as any).attendee?.name?.charAt(0) || '?'}
                                                                    </div>
                                                                    <span className="text-sm text-slate-700">{(meeting as any).attendee?.name || 'Unknown'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600 text-sm">
                                                                {new Date(meeting.startTime).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600">
                                                                {meeting.durationMinutes} mins
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                        meeting.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                            'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                    {meeting.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                {meeting.link ? (
                                                                    <a href={meeting.link} target="_blank" className="text-blue-600 hover:underline text-sm font-medium">Join</a>
                                                                ) : (
                                                                    <span className="text-slate-400 text-sm">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 flex-1">No scheduled meetings found.</div>
                                    )}
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {totalCount > LIMIT && (
                                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        Showing {((page - 1) * LIMIT) + 1} to {Math.min(page * LIMIT, totalCount)} of {totalCount} results
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
