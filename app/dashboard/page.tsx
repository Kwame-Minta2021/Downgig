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

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <span className="text-sm font-medium text-slate-500">{label}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
    );
}

function ClientDashboard() {
    const { currentUser, projects } = useApp();
    const router = useRouter();

    // Stats for Client
    const myProjects = projects.filter(p => p.clientName === currentUser?.name);
    const activeProjects = myProjects.filter(p => p.status === 'open').length;
    const totalSpent = 0; // Placeholder for now

    return (
        <div className="space-y-8">
            {/* Client Welcome Section */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-3">Welcome, {currentUser?.name}</h1>
                        <p className="text-slate-300 max-w-xl text-lg">
                            Manage your projects, review proposals, and hire top talent from your university network.
                        </p>
                    </div>
                    <Link href="/projects/new">
                        <Button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold border-none px-8 py-6 text-lg shadow-lg shadow-amber-500/20">
                            <Plus className="w-5 h-5 mr-2" />
                            Post New Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Client Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<FileText className="w-6 h-6" />}
                    label="Posted Projects"
                    value={myProjects.length}
                    color="blue"
                />
                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Total Hires"
                    value={0}
                    color="green"
                />
                <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    label="Total Spent"
                    value={`GH₵ ${totalSpent}`}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: My Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-900">Your Projects</h2>
                        <Link href="/my-jobs" className="text-blue-600 font-medium hover:underline">View All</Link>
                    </div>

                    {myProjects.length > 0 ? (
                        <div className="space-y-4">
                            {myProjects.slice(0, 3).map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Projects Yet</h3>
                            <p className="text-slate-500 mb-6">Start by posting your first project to find talent.</p>
                            <Link href="/projects/new">
                                <Button variant="outline">Create Project</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar: Quick Actions & Tips */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={() => router.push('/developers')}>
                                <Search className="w-4 h-4 mr-2" /> Find Talent
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={() => router.push('/profile')}>
                                <User className="w-4 h-4 mr-2" /> Company Profile
                            </Button>
                        </div>
                    </Card>

                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Hiring Tip</h3>
                        <p className="text-blue-700 text-sm leading-relaxed">
                            Clear project descriptions attract 30% more proposals. specificy deliverables clearly!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DeveloperDashboard() {
    const { currentUser, projects } = useApp();
    const router = useRouter();

    // Stats for Developer
    const availableProjects = projects.filter(p => p.status === 'open').length;
    const myApplications = 0; // Placeholder
    const earnings = currentUser?.balance || 0;

    return (
        <div className="space-y-8">
            {/* Developer Welcome */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
                            Available for Work
                        </span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-3">Hello, {currentUser?.name}</h1>
                    <p className="text-slate-600 max-w-xl text-lg">
                        Ready to take on new challenges? There are <span className="font-bold text-amber-600">{availableProjects} new projects</span> matching your skills today.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/projects">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 h-auto text-lg shadow-xl shadow-slate-900/20">
                            Find Work
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Developer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    label="Earnings"
                    value={`GH₵ ${earnings}`}
                    color="green"
                />
                <StatCard
                    icon={<CheckCircle className="w-6 h-6" />}
                    label="Jobs Completed"
                    value={currentUser?.completedProjects || 0}
                    color="blue"
                />
                <StatCard
                    icon={<Star className="w-6 h-6" />}
                    label="Success Rate"
                    value={`${currentUser?.successRate || 100}%`}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Recommended Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
                        <Link href="/projects" className="text-blue-600 font-medium hover:underline">Browse All</Link>
                    </div>

                    <div className="space-y-4">
                        {projects.slice(0, 3).map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Your Profile</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[85%]"></div>
                            </div>
                            <span className="text-sm font-bold text-slate-700">85%</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Complete your portfolio to rank higher in searches.</p>
                        <Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>
                            Enhance Profile
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { currentUser, isLoading } = useApp();
    const router = useRouter();

    // Redirect if not logged in or Developer needs onboarding
    useEffect(() => {
        if (!isLoading) {
            if (!currentUser) {
                router.push('/login');
            } else if (currentUser.role === 'developer' && currentUser.status === 'pending' && !currentUser.headline) {
                // If pending and no headline (proxy for partial profile), go to onboarding
                router.push('/onboarding');
            }
        }
    }, [currentUser, isLoading, router]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div>;
    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                {currentUser.status === 'pending' && (
                    <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="p-3 bg-amber-100 text-amber-700 rounded-full shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Account Under Review</h2>
                            <p className="text-slate-600">
                                Your account is currently pending administrator approval.
                                {currentUser.role === 'developer'
                                    ? " You can browse projects, but you won't be able to submit proposals until verified."
                                    : " You can draft projects, but they won't be visible to freelancers until approved."}
                            </p>
                        </div>
                    </div>
                )} {currentUser.status === 'rejected' && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-700 rounded-full shrink-0">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Account Application Rejected</h2>
                            <p className="text-slate-600">Please contact support for more information regarding your account status.</p>
                        </div>
                    </div>
                )}

                {currentUser.role === 'client' ? <ClientDashboard /> : <DeveloperDashboard />}
            </main>
        </div>
    );
}
