'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Project, Message, Contract, Notification, Transaction, Meeting, PortfolioItem, Proposal } from '@/lib/types';

interface AppContextType {
    currentUser: User | null;
    isLoading: boolean;
    projects: Project[];
    messages: Message[];
    contracts: Contract[];
    notifications: Notification[];
    transactions: Transaction[];
    meetings: Meeting[];

    // Auth
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (data: Partial<User> & { password: string }) => Promise<{ error: any }>;
    signOut: () => Promise<void>;

    // Actions
    postProject: (data: any) => Promise<{ error: any }>;
    getProjectById: (id: number) => Project | undefined; // Still synchronous for local state lookups, or could be async fetch
    submitProposal: (data: { projectId: number; coverLetter: string; amount: number; timeline: string }) => Promise<{ error: any }>;
    acceptProposal: (proposalId: number, projectId: number) => Promise<{ error: any }>;
    sendMessage: (receiverId: string, content: string) => Promise<{ error: any }>;
    createContract: (proposal: Proposal, project: Project) => Promise<void>;

    // Misc
    toggleSavedProject: (projectId: number) => void; // Local state or DB?
    markNotificationRead: (id: number) => void;
    scheduleMeeting: (data: any) => Promise<void>;
    addPortfolioItem: (item: any) => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    uploadImage: (file: File, folder?: string) => Promise<string>;

    // Global User List (for demo/messaging)
    users: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Local State Mirrors
    const [projects, setProjects] = useState<Project[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [users, setUsers] = useState<User[]>([]); // Mirrors 'profiles' table

    // Stubs for features not yet fully DB-backed (or less critical)
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            setIsLoading(true);

            // 1. Get Initial Session
            const { data: { session } } = await supabase.auth.getSession();

            if (mounted) {
                if (session) {
                    // Only fetch user profile if we have a session
                    await fetchUserProfile(session.user.id);
                    await fetchTransactions(session.user.id); // Fetch transactions
                } else {
                    setCurrentUser(null);
                }

                // 2. Fetch Global Data (Projects, Public Users)
                fetchProjects();
                fetchUsers();

                setIsLoading(false);
            }
        };

        initialize();

        // Auth Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                if (session) {
                    if (event === 'SIGNED_IN') {
                        await fetchUserProfile(session.user.id);
                        await fetchTransactions(session.user.id);
                    }
                    // Setup Realtime Subscription
                    subscribeToMessages(session.user.id);
                }
            } else if (event === 'SIGNED_OUT') {
                setCurrentUser(null);
                setMessages([]);
                router.push('/');
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
            supabase.channel('messages_channel').unsubscribe();
        };
    }, []);

    // --- Realtime ---
    const subscribeToMessages = (userId: string) => {
        const channel = supabase
            .channel('messages_channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${userId}` // Listen for incoming messages
                },
                (payload) => {
                    const newMessage = {
                        ...payload.new,
                        senderId: payload.new.sender_id,
                        receiverId: payload.new.receiver_id
                    } as Message;

                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();
    };

    // --- Data Fetching Helpers ---



    const fetchUserProfile = async (userId: string) => {
        // Parallel Data Fetching for Performance
        const [profileResult, portfolioResult, reviewsResult] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('portfolio_items').select('*').eq('user_id', userId),
            supabase.from('reviews').select('*').eq('user_id', userId)
        ]);

        const profileData = profileResult.data;

        if (profileData) {
            setCurrentUser({
                ...profileData,
                portfolio: portfolioResult.data || [],
                reviews: reviewsResult.data || []
            });

            // Fetch messages in parallel to UI rendering
            fetchMessages(profileData.id);
        } else if (userId) {
            // Self-Healing: If Auth exists but Profile is missing (e.g. Trigger failed), try to create it manually.
            console.warn('Profile missing for authenticated user. Attempting recovery...');

            const { data: { user } } = await supabase.auth.getUser();

            if (user && user.id === userId) {
                const { error: insertError } = await supabase.from('profiles').insert([{
                    id: user.id,
                    name: user.user_metadata?.name || 'User',
                    email: user.email,
                    role: user.user_metadata?.role || 'client',
                    status: 'approved', // Default recovery status
                    university: user.user_metadata?.university || '',
                    avatar: user.user_metadata?.avatar, // Ensure avatar is preserved
                    bio: ''
                }]);

                if (!insertError) {
                    // Retry fetching the profile
                    const { data: recoveredProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
                    if (recoveredProfile) {
                        setCurrentUser({
                            ...recoveredProfile,
                            portfolio: [], // New profile has no items
                            reviews: []
                        });
                    }
                } else {
                    console.error('Critical: Failed to recover user profile.', insertError);
                    // Optionally force sign out if we really can't recover?
                    // await supabase.auth.signOut(); 
                }
            }
        }
    };

    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                proposals (*)
            `)
            .order('created_at', { ascending: false });

        if (data) {
            const mappedProjects = data.map((p: any) => ({
                ...p,
                createdAt: p.created_at,
                clientId: p.client_id,
                clientName: p.client_name || 'Anonymous',
                flyerUrl: p.flyer_url,
                // proposals need mapping too
                proposals: p.proposals.map((prop: any) => ({
                    ...prop,
                    developerId: prop.developer_id,
                    developerName: prop.developer_name || 'Unknown',
                    developerAvatar: prop.developer_avatar,
                    coverLetter: prop.cover_letter
                }))
            }));
            setProjects(mappedProjects);
        }
    };

    const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('*');
        if (data) setUsers(data);
    };

    const fetchMessages = async (userId: string) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('timestamp', { ascending: true });

        if (data) {
            const mapped = data.map((m: any) => ({
                ...m,
                senderId: m.sender_id,
                receiverId: m.receiver_id,
                read: m.is_read // Map DB is_read to type read
            }));
            setMessages(mapped);
        }
    };

    const fetchTransactions = async (userId: string) => {
        const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (data) {
            // Map DB fields if needed, but schema matches typical usage
            const mapped = data.map((t: any) => ({
                ...t,
                date: t.created_at // Map created_at to date for UI
            }));
            setTransactions(mapped);
        }
    };

    // --- Auth Actions ---

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const signUp = async (userData: Partial<User> & { password: string }) => {
        // 1. Create Auth User with Metadata for Trigger
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email!,
            password: userData.password,
            options: {
                data: {
                    name: userData.name,
                    role: userData.role,
                    university: userData.university,
                    avatar: userData.avatar,
                }
            }
        });

        // The Postgres Trigger 'handle_new_user' will automatically create the profile row.
        // No manual insert needed. This ensures it works even if email confirmation is pending.
        // Note: The Trigger runs as SECURITY DEFINER, invoking admin privileges to bypass RLS.

        return { error: authError };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        router.push('/');
    };

    // --- Feature Actions ---

    const postProject = async (projectData: any) => {
        if (!currentUser) return { error: 'Not logged in' };
        if (currentUser.status !== 'approved') return { error: 'Your account is pending approval.' };

        // Map camelCase to snake_case
        const dbPayload = {
            title: projectData.title,
            description: projectData.description,
            requirements: projectData.requirements,
            budget: projectData.budget,
            timeline: projectData.timeline,
            level: projectData.level,
            category: projectData.category,
            skills: projectData.skills, // Array as JSONB or text[] depending on schema
            urgent: projectData.urgent,
            client_id: currentUser.id,
            client_name: currentUser.name,
            university: currentUser.university,
            flyer_url: projectData.flyerUrl,
            location: projectData.location,
            status: 'pending_approval' // Default to pending approval
        };

        const { data, error } = await supabase.from('projects').insert([dbPayload]).select();

        if (!error && data) {
            // fetchProjects(); // Projects only shows OPEN projects, so this won't show it immediately to public
            // Maybe show a toast that it's pending?
        }
        return { error };
    };

    const sendMessage = async (receiverId: string, content: string) => {
        if (!currentUser) return { error: 'Not logged in' };

        const tempId = Date.now(); // Optimistic ID
        const newMessage: Message = {
            id: tempId,
            senderId: currentUser.id,
            receiverId: receiverId,
            content,
            timestamp: new Date().toISOString(),
            read: false
        };

        // Optimistic Update
        setMessages(prev => [...prev, newMessage]);

        const { data, error } = await supabase.from('messages').insert([{
            sender_id: currentUser.id,
            receiver_id: receiverId,
            content,
            timestamp: newMessage.timestamp,
            is_read: false // Use DB column name
        }]).select().single();

        if (error) {
            // Revert on error
            setMessages(prev => prev.filter(m => m.id !== tempId));
            return { error };
        }

        // Update optimistic message with real ID
        if (data) {
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, ...data, id: data.id } : m));
        }

        return { error: null };
    };

    const submitProposal = async (data: { projectId: number; coverLetter: string; amount: number; timeline: string }) => {
        if (!currentUser) return { error: 'Not logged in' };
        if (currentUser.status !== 'approved') return { error: 'Your account is pending approval.' };

        const { error } = await supabase.from('proposals').insert([{
            project_id: data.projectId,
            developer_id: currentUser.id,
            developer_name: currentUser.name,
            developer_avatar: currentUser.avatar,
            cover_letter: data.coverLetter,
            amount: data.amount,
            timeline: data.timeline,
            status: 'pending'
        }]);

        if (!error) fetchProjects(); // Refresh to see new proposal count
        return { error };
    };

    const acceptProposal = async (proposalId: number, projectId: number) => {
        // 1. Update Proposal Status
        const { error: propError } = await supabase
            .from('proposals')
            .update({ status: 'accepted' })
            .eq('id', proposalId);

        if (propError) return { error: propError };

        // 2. Update Project Status
        const { error: projError } = await supabase
            .from('projects')
            .update({ status: 'in_progress' })
            .eq('id', projectId);

        // 3. Create Contract (Ideally a DB Trigger or backend function)
        // For now we just refresh
        fetchProjects();
        return { error: projError };
    };

    // --- Placeholders/Partials ---

    const getProjectById = (id: number) => {
        return projects.find(p => p.id === Number(id)); // Parse int just in case
    };

    const toggleSavedProject = (projectId: number) => {
        // Implement save logic later (requires saved_projects table)
        console.log('Toggle save', projectId);
    };

    const markNotificationRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const createContract = async (proposal: Proposal, project: Project) => {
        // Placeholder
    };

    const scheduleMeeting = async (data: any) => {
        // Placeholder
    };

    const addPortfolioItem = async (item: any) => {
        if (!currentUser) return;
        const { error } = await supabase.from('portfolio_items').insert([{
            user_id: currentUser.id,
            title: item.title,
            description: item.description,
            image_urls: item.imageUrls,
            link: item.link
        }]);
        if (!error) fetchUserProfile(currentUser.id);
    };

    const updateProfile = async (updates: Partial<User>) => {
        if (!currentUser) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                name: updates.name,
                email: updates.email,
                university: updates.university,
                bio: updates.bio,
                avatar: updates.avatar,
                headline: updates.headline,
                phone: updates.phone,
                linkedin: updates.linkedin,
                github: updates.github,
            })
            .eq('id', currentUser.id);

        if (!error) {
            await fetchUserProfile(currentUser.id);
        }
    };

    const uploadImage = async (file: File, folder: string = 'uploads') => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            isLoading,
            users,
            projects,
            messages,
            contracts,
            notifications,
            transactions,
            meetings,
            signIn,
            signOut,
            signUp,
            postProject,
            getProjectById,
            submitProposal,
            acceptProposal,
            sendMessage,
            createContract,
            toggleSavedProject,
            markNotificationRead,
            scheduleMeeting,
            addPortfolioItem,
            updateProfile,
            uploadImage
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
