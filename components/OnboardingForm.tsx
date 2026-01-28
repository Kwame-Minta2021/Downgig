'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronRight, Upload, Plus, Trash2, Github, Linkedin, Smartphone, Briefcase } from 'lucide-react';

export default function OnboardingForm() {
    const router = useRouter();
    const { currentUser, updateProfile, addPortfolioItem, uploadImage } = useApp();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Profile Data
    const [profileData, setProfileData] = useState({
        headline: '',
        bio: '',
        phone: '',
        linkedin: '',
        github: '',
        avatar: null as File | null,
    });

    // Portfolio Data
    const [portfolioItems, setPortfolioItems] = useState<{
        title: string;
        description: string;
        link: string;
        image: File | null;
    }[]>([
        { title: '', description: '', link: '', image: null }
    ]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePortfolioChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newItems = [...portfolioItems];
        // @ts-ignore
        newItems[index][e.target.name] = e.target.value;
        setPortfolioItems(newItems);
    };

    const handlePortfolioImage = (index: number, file: File) => {
        const newItems = [...portfolioItems];
        newItems[index].image = file;
        setPortfolioItems(newItems);
    };

    const addPortfolioRow = () => {
        setPortfolioItems([...portfolioItems, { title: '', description: '', link: '', image: null }]);
    };

    const removePortfolioRow = (index: number) => {
        setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // 1. Upload Avatar if present
            let avatarUrl = currentUser?.avatar;
            if (profileData.avatar) {
                avatarUrl = await uploadImage(profileData.avatar, 'avatars');
            }

            // 2. Update Profile
            await updateProfile({
                headline: profileData.headline,
                bio: profileData.bio,
                phone: profileData.phone,
                linkedin: profileData.linkedin,
                github: profileData.github,
                avatar: avatarUrl,
                status: 'pending' // Ensure status is pending until admin approves
            });

            // 3. Upload Portfolio Items
            for (const item of portfolioItems) {
                if (item.title && item.description) {
                    let itemImageUrl = '';
                    if (item.image) {
                        itemImageUrl = await uploadImage(item.image, 'portfolio');
                    }

                    await addPortfolioItem({
                        title: item.title,
                        description: item.description,
                        link: item.link,
                        imageUrls: itemImageUrl ? [itemImageUrl] : []
                    });
                }
            }

            // Redirect to Dashboard (which should show a "Pending" state)
            router.push('/dashboard');

        } catch (error) {
            console.error('Onboarding failed:', error);
            // Handle error (show toast)
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-8 py-6 text-white">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-500 font-bold tracking-wider text-xs uppercase">Developer Setup</span>
                    <span className="text-slate-400 text-xs">Step {step} of 2</span>
                </div>
                <h1 className="text-2xl font-serif font-bold">
                    {step === 1 ? 'Build your Professional Profile' : 'Showcase your Work'}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                    {step === 1 ? 'Clients want to know who they are hiring. Make a great first impression.' : 'Add at least one project to demonstrate your skills.'}
                </p>
            </div>

            <div className="p-8 space-y-6">
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
                        {/* Avatar Upload */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden relative group">
                                {profileData.avatar ? (
                                    <img
                                        src={URL.createObjectURL(profileData.avatar)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-slate-400 text-center">
                                        <Upload className="w-6 h-6 mx-auto mb-1" />
                                        <span className="text-xs">Photo</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && setProfileData({ ...profileData, avatar: e.target.files[0] })}
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Profile Photo</h3>
                                <p className="text-slate-500 text-sm">Upload a professional headshot.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Professional Headline</label>
                            <Input
                                name="headline"
                                value={profileData.headline}
                                onChange={handleProfileChange}
                                placeholder="e.g. Full Stack Developer | React & Node.js Expert"
                                className="font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Bio / Summary</label>
                            <textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[100px]"
                                placeholder="Briefly describe your expertise and experience..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-slate-400" /> Phone Number
                                </label>
                                <Input
                                    name="phone"
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    placeholder="+233 20 123 4567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Github className="w-4 h-4 text-slate-400" /> GitHub URL
                                </label>
                                <Input
                                    name="github"
                                    value={profileData.github}
                                    onChange={handleProfileChange}
                                    placeholder="github.com/username"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 text-slate-400" /> LinkedIn URL (Optional)
                                </label>
                                <Input
                                    name="linkedin"
                                    value={profileData.linkedin}
                                    onChange={handleProfileChange}
                                    placeholder="linkedin.com/in/username"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!profileData.headline || !profileData.bio || !profileData.phone}
                                className="bg-slate-900 text-white rounded-full px-8 hover:bg-slate-800"
                            >
                                Next Step <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
                        <div className="space-y-6">
                            {portfolioItems.map((item, index) => (
                                <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative group">
                                    {portfolioItems.length > 1 && (
                                        <button
                                            onClick={() => removePortfolioRow(index)}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}

                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-blue-500" /> Project {index + 1}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <Input
                                                name="title"
                                                value={item.title}
                                                onChange={(e) => handlePortfolioChange(index, e)}
                                                placeholder="Project Title"
                                                className="bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                name="link"
                                                value={item.link}
                                                onChange={(e) => handlePortfolioChange(index, e)}
                                                placeholder="Project Link (URL)"
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <textarea
                                            name="description"
                                            value={item.description}
                                            onChange={(e) => handlePortfolioChange(index, e)}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[80px] text-sm bg-white"
                                            placeholder="Description of the project..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Project Screenshot</label>
                                        <input
                                            type="file"
                                            onChange={(e) => e.target.files?.[0] && handlePortfolioImage(index, e.target.files[0])}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            onClick={addPortfolioRow}
                            className="w-full border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Another Project
                        </Button>

                        <div className="flex justify-between pt-6 border-t border-slate-100">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="text-slate-500"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !portfolioItems[0].title}
                                className="bg-amber-500 text-slate-900 font-bold rounded-full px-8 hover:bg-amber-400 min-w-[150px]"
                            >
                                {isLoading ? 'Submitting...' : 'Complete Setup'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
