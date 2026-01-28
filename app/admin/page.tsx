import { getAdminStats } from '@/actions/admin';
import AdminDashboard from './AdminDashboard';
import Header from '@/components/Header';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const { stats, error } = await getAdminStats();

    if (error === 'Unauthorized') {
        redirect('/dashboard');
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Dashboard</h1>
                    <p className="text-slate-600">{error || 'Unknown error occurred'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <AdminDashboard initialStats={stats} />
        </div>
    );
}
