'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Camera, Mail, Briefcase, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { PortfolioItem } from '@/lib/types';

export default function ProfilePage() {
    const router = useRouter();
    const { currentUser, addPortfolioItem, updateProfile, uploadImage, isLoading } = useApp();
    const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews' | 'settings'>('overview');
    const [showPortfolioForm, setShowPortfolioForm] = useState(false);
    const [newPortfolioItem, setNewPortfolioItem] = useState<Partial<PortfolioItem>>({
        title: '',
        description: '',
        imageUrls: [],
        link: ''
    });
    const [uploading, setUploading] = useState(false);

    // Avatar Upload
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        try {
            setUploading(true);
            const url = await uploadImage(file, 'avatars');
            await updateProfile({ avatar: url });
        } catch (error) {
            console.error('Avatar upload failed', error);
            alert('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        university: '',
        bio: '',
        location: ''
    });

    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!currentUser) {
                router.push('/login');
            } else {
                setFormData({
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                    university: currentUser.university || '',
                    bio: currentUser.bio || '',
                    location: currentUser.location || ''
                });
            }
        }
    }, [currentUser, isLoading, router]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div>;
    if (!currentUser) return null;

    const handleAddPortfolio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPortfolioItem.title && newPortfolioItem.description) {
            await addPortfolioItem(newPortfolioItem);
            setShowPortfolioForm(false);
            setNewPortfolioItem({ title: '', description: '', imageUrls: [], link: '' });
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateSuccess(false);
        setIsSaving(true);

        const { error } = await updateProfile({
            name: formData.name,
            email: formData.email,
            university: formData.university,
            bio: formData.bio,
            location: formData.location
        });

        setIsSaving(false);

        if (error) {
            setUpdateError('Failed to update profile. Please try again.');
            console.error(error);
        } else {
            setUpdateSuccess(true);
            setTimeout(() => {
                setUpdateSuccess(false);
                setActiveTab('overview');
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">


            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center sticky top-24">
                        <div className="relative inline-block mb-6">
                            <UserAvatar
                                user={currentUser}
                                className="w-40 h-40 text-6xl shadow-2xl mx-auto border-4 border-white"
                                size="xl"
                            />
                            <label className="absolute bottom-2 right-2 p-2.5 bg-white rounded-full shadow-lg border border-slate-100 text-slate-600 hover:text-amber-600 transition-colors cursor-pointer">
                                <Camera className="w-5 h-5" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-1">{currentUser.name}</h1>
                        <p className="text-slate-500 mb-4 font-medium tracking-wide uppercase text-sm">
                            {currentUser.role === 'client' ? 'Client • Researcher' : 'Senior Developer'}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                {currentUser.university || 'No University'}
                            </span>
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-100">
                                <span>★</span>
                                <span>{currentUser.rating ? currentUser.rating.toFixed(1) : 'NEW'}</span>
                            </div>
                        </div>

                        <div className="space-y-4 text-left border-t border-slate-100 pt-6">
                            <div className="flex items-center text-slate-600 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-amber-50 transition-colors">
                                    <Mail className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                                </div>
                                <span className="font-medium text-sm">{currentUser.email}</span>
                            </div>
                            <div className="flex items-center text-slate-600 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-amber-50 transition-colors">
                                    <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                                </div>
                                <span className="font-medium text-sm">
                                    {currentUser.projectsPosted ?? currentUser.proposalsSent} Projects {currentUser.role === 'client' ? 'Posted' : 'Applied'}
                                </span>
                            </div>
                            <div className="flex items-center text-slate-600 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-amber-50 transition-colors">
                                    <span className="text-lg">📍</span>
                                </div>
                                <span className="font-medium text-sm">
                                    {currentUser.location || 'Location not set'}
                                </span>
                            </div>
                            {currentUser.role === 'developer' && (
                                <div className="flex items-center text-slate-600 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-amber-50 transition-colors">
                                        <Award className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                                    </div>
                                    <span className="font-medium text-sm">{currentUser.successRate}% Success Rate</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <Button className="w-full justify-center" variant="outline" onClick={() => setActiveTab('settings')}>
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 border-b border-slate-200/60 sticky top-0 bg-slate-50/95 backdrop-blur z-10 pt-2">
                        {
                            ['overview', 'portfolio', 'reviews', 'settings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-200 capitalize ${activeTab === tab
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                        : 'bg-white text-slate-500 hover:bg-white hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))
                        }
                    </div>

                    {/* Overview Tab */}
                    {
                        activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        ✨ About Me
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {currentUser.bio || 'No bio provided yet. Tell others about your expertise!'}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    }

                    {/* Portfolio Tab */}
                    {
                        activeTab === 'portfolio' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Portfolio Data</h2>
                                        <p className="text-slate-500">Showcase your previous work to build trust.</p>
                                    </div>
                                    <Button onClick={() => setShowPortfolioForm(true)} className="rounded-full shadow-lg shadow-amber-500/20">
                                        + Add Project
                                    </Button>
                                </div>

                                {showPortfolioForm && (
                                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                        <h3 className="font-bold text-xl mb-6">Add New Project</h3>
                                        <form onSubmit={handleAddPortfolio} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="e.g. E-commerce Mobile App"
                                                        value={newPortfolioItem.title}
                                                        onChange={e => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Project Images</label>
                                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-amber-400 transition-colors cursor-pointer group relative">
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    try {
                                                                        const url = await uploadImage(e.target.files[0], 'portfolio');
                                                                        setNewPortfolioItem(prev => ({
                                                                            ...prev,
                                                                            imageUrls: [...(prev.imageUrls || []), url]
                                                                        }));
                                                                    } catch (err) {
                                                                        alert('Failed to upload image');
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                            <Camera className="w-8 h-8" />
                                                        </div>
                                                        <p className="font-bold text-slate-700">
                                                            {newPortfolioItem.imageUrls && newPortfolioItem.imageUrls.length > 0
                                                                ? `${newPortfolioItem.imageUrls.length} Image(s) Uploaded`
                                                                : 'Click to upload images'}
                                                        </p>
                                                        <p className="text-sm text-slate-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                                    <textarea
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32"
                                                        placeholder="Describe what you built..."
                                                        value={newPortfolioItem.description}
                                                        onChange={e => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Live Link (Optional)</label>
                                                    <input
                                                        type="url"
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="https://..."
                                                        value={newPortfolioItem.link}
                                                        onChange={e => setNewPortfolioItem({ ...newPortfolioItem, link: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                                <Button type="button" variant="ghost" onClick={() => setShowPortfolioForm(false)}>Cancel</Button>
                                                <Button type="submit">Save & Publish</Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentUser.portfolio && currentUser.portfolio.length > 0 ? (
                                        currentUser.portfolio.map(item => (
                                            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300">
                                                <div className="h-48 bg-slate-100 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-200/50"></div>
                                                    <img
                                                        src={item.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=Project+Preview'}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                                                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">{item.description}</p>
                                                    {item.link && (
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700">
                                                            View Project <Briefcase className="w-4 h-4 ml-2" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Briefcase className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
                                            <p className="text-slate-500 mb-8 max-w-md mx-auto">Upload your best work to show clients what you're capable of.</p>
                                            <Button variant="outline" onClick={() => setShowPortfolioForm(true)}>
                                                Create First Entry
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    }

                    {/* Reviews Tab */}
                    {
                        activeTab === 'reviews' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Client Feedback</h2>
                                <div className="grid gap-6">
                                    {currentUser.reviews && currentUser.reviews.length > 0 ? (
                                        currentUser.reviews.map(review => (
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
                                                <p className="text-slate-600 italic leading-relaxed">"{review.comment}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-500">No reviews yet</div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    }

                    {/* Settings Tab */}
                    {
                        activeTab === 'settings' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                            <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">University / Organization</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
                                            <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Accra, Ghana" />
                                        </div>
                                    </div>
                                    {updateError && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 col-span-2">
                                            {updateError}
                                        </div>
                                    )}
                                    {updateSuccess && (
                                        <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100 col-span-2">
                                            Profile updated successfully!
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-6 border-t border-slate-100">
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
