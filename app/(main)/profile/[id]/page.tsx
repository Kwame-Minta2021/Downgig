'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, PortfolioItem, Review } from '@/lib/types';

import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Briefcase, Award, Mail, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { currentUser, sendMessage } = useApp();
    const [profile, setProfile] = useState<User | null>(null);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = params.id as string;
                if (!userId) return;

                // 1. Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (profileError) throw profileError;

                // 2. Fetch Portfolio
                const { data: portfolioData } = await supabase
                    .from('portfolio_items')
                    .select('*')
                    .eq('user_id', userId);

                // 3. Fetch Reviews
                const { data: reviewsData } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('user_id', userId);

                setProfile(profileData);
                setPortfolio(portfolioData || []);
                setReviews(reviewsData || []);

            } catch (err: any) {
                console.error('Error fetching profile:', err);
                setError('User not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [params.id]);

    const handleMessage = async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        if (profile) {
            // Optimistic jump to messages
            // ideally we start a conversation thread here
            router.push('/messages');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div>;

    if (error || !profile) return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">User Not Found</h2>
                <p className="text-slate-500 mb-6">The profile you are looking for does not exist.</p>
                <Button onClick={() => router.push('/')}>Go Home</Button>
            </div>
        </div>
    );

    // Access Control for Pending Developers
    if (profile.role === 'developer' && profile.status !== 'approved') {
        const isOwner = currentUser?.id === profile.id;
        const isAdmin = currentUser?.role === 'admin';

        if (!isOwner && !isAdmin) {
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Under Review</h2>
                        <p className="text-slate-500 mb-6">This developer's profile is currently pending approval.</p>
                        <Button onClick={() => router.push('/')}>Go Home</Button>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">


            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center sticky top-24">
                        <UserAvatar
                            user={profile}
                            className="w-40 h-40 text-6xl shadow-2xl mx-auto border-4 border-white mb-6"
                            size="xl"
                        />

                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-1">{profile.name}</h1>
                        <p className="text-slate-500 mb-4 font-medium tracking-wide uppercase text-sm">
                            {profile.role === 'client' ? 'Client • Researcher' : 'Senior Developer'}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {profile.university && (
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {profile.university}
                                </span>
                            )}
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-100">
                                <span>★</span>
                                <span>{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'NEW'}</span>
                            </span>
                        </div>

                        <div className="space-y-4 text-left border-t border-slate-100 pt-6">
                            {profile.location && (
                                <div className="flex items-center text-slate-600">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3">
                                        <span className="text-lg">📍</span>
                                    </div>
                                    <span className="font-medium text-sm">{profile.location}</span>
                                </div>
                            )}
                            <div className="flex items-center text-slate-600">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <span className="font-medium text-sm">{profile.email}</span>
                            </div>
                        </div>

                        {currentUser?.id !== profile.id && (
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <Button className="w-full justify-center shadow-lg shadow-blue-500/20" onClick={handleMessage}>
                                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Bio */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                            ✨ About
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {profile.bio || 'No bio provided.'}
                        </p>
                    </div>

                    {/* Portfolio */}
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Portfolio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {portfolio.length > 0 ? (
                                portfolio.map(item => (
                                    <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                                            <img
                                                src={item.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=Project+Preview'}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-600 text-sm line-clamp-3 mb-4">{item.description}</p>
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700">
                                                    View Project <Briefcase className="w-4 h-4 ml-2" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500">
                                    No portfolio items yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Reviews</h2>
                        <div className="space-y-4">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span key={i} className={`text-lg ${i < review.rating ? 'fill-current' : 'text-slate-200'}`}>★</span>
                                                    ))}
                                                </div>
                                                <h4 className="font-bold text-slate-900">{review.reviewerName}</h4>
                                            </div>
                                            <span className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-600 italic">"{review.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500">
                                    No reviews yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
