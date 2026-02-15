'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User, Project, Transaction } from '@/lib/types';

// Helper to get Supabase Client
async function getSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async get(name: string) {
                    const cookieStore = await cookies();
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
}

// Helper to verify Admin
async function verifyAdmin() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role === 'admin';
}

export async function getAdminStats() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();

    // Use the RPC function for performance if available, else fallback
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

    if (error) {
        console.error('RPC Error, falling back to raw queries:', error);
        // Fallback implementation
        const { count: clientCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client');
        const { count: devCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'developer');
        const { count: pendingCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const { data: transactions } = await supabase.from('transactions').select('amount');
        const totalVolume = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        return {
            clientCount: clientCount || 0,
            developerCount: devCount || 0,
            pendingCount: pendingCount || 0,
            totalVolume: totalVolume
        };
    }

    return data;
}

export async function getPendingDevelopers() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            portfolio_items (*)
        `)
        .eq('role', 'developer')
        .eq('status', 'pending');

    if (error) return { error: error.message };

    // Map portfolio items to the correct type structure if needed
    const mappedUsers = data?.map((user: any) => ({
        ...user,
        portfolio: user.portfolio_items?.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrls: item.image_urls || [],
            link: item.link
        })) || []
    }));

    return { data: mappedUsers as User[] };
}

export async function getPendingProjects() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data: data as Project[] };
}

export async function getAllClients() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client');

    if (error) return { error: error.message };
    return { data: data as User[] };
}

export async function getAllTransactions() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            user:user_id (name, email)
        `)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data: data as Transaction[] };
}

export async function updateUserStatus(userId: string, status: 'approved' | 'rejected') {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);

    return { error };
}

export async function updateProjectStatus(projectId: number, status: 'open' | 'rejected') {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();

    // Use the RPC function if enforcing rigorous checks, or direct update
    // We'll use direct update as RLS policy for Admin allows it (created in migration)
    const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId);

    return { error };
}

export async function getAllMeetings() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from('meetings')
        .select(`
            *,
            host:host_id (name, email, avatar),
            attendee:attendee_id (name, email, avatar)
        `)
        .order('start_time', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}
