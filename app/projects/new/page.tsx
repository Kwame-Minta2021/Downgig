'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { ProjectFormData, AcademicLevel, ProjectCategory } from '@/lib/types';
import { ChevronLeft, Upload, FileText, AlertCircle, CheckCircle2, Clock, DollarSign, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();
    const { postProject, currentUser, uploadImage } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect if not logged in or not client
    useEffect(() => {
        if (!currentUser) {
            router.push('/login');
        } else if (currentUser.role !== 'client') {
            router.push('/dashboard');
        }
    }, [currentUser, router]);

    const [formData, setFormData] = useState<ProjectFormData>({
        title: '',
        level: '',
        category: '',
        description: '',
        requirements: '',
        budget: '',
        timeline: '',
        skills: '',
        urgent: false,
        location: '',
        flyer: null,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Validation
        if (!formData.level || !formData.category) {
            setError('Please select both academic level and category');
            setIsSubmitting(false);
            return;
        }

        if (!formData.budget || parseFloat(formData.budget) <= 0) {
            setError('Please enter a valid budget amount');
            setIsSubmitting(false);
            return;
        }

        // Upload Flyer if exists
        let flyerUrl = undefined;
        if (formData.flyer) {
            try {
                flyerUrl = await uploadImage(formData.flyer, 'flyers');
            } catch (err) {
                console.error('Flyer upload failed', err);
                setError('Failed to upload flyer. Please try again.');
                setIsSubmitting(false);
                return;
            }
        }

        const { error } = await postProject({
            title: formData.title,
            level: formData.level as AcademicLevel,
            category: formData.category as ProjectCategory,
            description: formData.description,
            requirements: formData.requirements,
            budget: parseFloat(formData.budget),
            timeline: formData.timeline,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            urgent: formData.urgent,
            location: formData.location,
            flyerUrl: flyerUrl,
        });

        if (error) {
            setError(error.message || 'Failed to post project.');
            setIsSubmitting(false);
            return;
        }

        setSuccess(true);
        // Redirect after delay
        setTimeout(() => {
            router.push('/projects');
        }, 2000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData(prev => ({ ...prev, flyer: e.dataTransfer.files[0] }));
        }
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Header />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-medium group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-3 tracking-tight">
                        Post a New Project
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Fill in the details below to connect with top-tier academic and technical talent.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Status Messages */}
                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold">Project Posted Successfully!</h3>
                                <p className="text-sm opacity-90">Redirecting you to your projects...</p>
                            </div>
                        </div>
                    )}

                    {/* Section 1: Basic Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                            <h2 className="font-bold text-slate-800">Project Basics</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Project Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="e.g., Thesis Data Analysis with Python"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-slate-400" /> Academic Level <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="level"
                                            value={formData.level}
                                            onChange={handleChange}
                                            className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none bg-white cursor-pointer"
                                            required
                                        >
                                            <option value="">Select Level</option>
                                            <option value="Undergraduate">Undergraduate</option>
                                            <option value="Masters">Masters</option>
                                            <option value="PhD">PhD</option>
                                            <option value="Professional">Professional</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-400" /> Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none bg-white cursor-pointer"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="Machine Learning">Machine Learning</option>
                                            <option value="Data Analysis">Data Analysis</option>
                                            <option value="IoT">IoT/Embedded</option>
                                            <option value="Blockchain">Blockchain</option>
                                            <option value="Cloud Computing">Cloud Computing</option>
                                            <option value="Cybersecurity">Cybersecurity</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Details & Files */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                            <h2 className="font-bold text-slate-800">Details & Requirements</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Project Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[160px] resize-y"
                                    placeholder="Provide a comprehensive overview of your project..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Technical Requirements <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[100px] resize-y"
                                    placeholder="Specific tools, languages, or constraints (e.g., 'Must use Python 3.8+', 'APA styling')..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Skills Required <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="e.g., Pandas, React Native, SQL (Comma separated)"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3 block">
                                    Attachments (Optional)
                                </label>
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="flyer"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFormData(prev => ({ ...prev, flyer: e.target.files![0] }));
                                            }
                                        }}
                                        className="hidden"
                                        id="flyer-upload"
                                        accept="image/*,.pdf"
                                    />

                                    {formData.flyer ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <p className="font-semibold text-slate-900 mb-1">{formData.flyer.name}</p>
                                            <p className="text-xs text-slate-500 mb-4">{(formData.flyer.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFormData(prev => ({ ...prev, flyer: null }));
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="flyer-upload" className="cursor-pointer block h-full w-full">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                                                    <Upload className="w-6 h-6" />
                                                </div>
                                                <p className="font-semibold text-slate-900">Click to upload or drag and drop</p>
                                                <p className="text-sm text-slate-500 mt-1">PDF, PNG, or JPG (max 5MB)</p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Logistics */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                            <h2 className="font-bold text-slate-800">Logistics</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-slate-400" /> Budget (GH₵) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-500 font-bold">GH₵</span>
                                        <input
                                            type="number"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                            placeholder="5000"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400" /> Timeline <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="timeline"
                                            value={formData.timeline}
                                            onChange={handleChange}
                                            className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none bg-white cursor-pointer"
                                            required
                                        >
                                            <option value="">Select Timeline</option>
                                            <option value="1-2 weeks">1-2 weeks</option>
                                            <option value="3-4 weeks">3-4 weeks</option>
                                            <option value="1-2 months">1-2 months</option>
                                            <option value="3+ months">3+ months</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" /> Preferred Location (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="e.g. Remote, Legon Campus, Accra"
                                />
                            </div>

                            <div className="pt-2">
                                <label className="relative flex items-start p-4 rounded-xl border border-red-100 bg-red-50/50 cursor-pointer hover:bg-red-50 transition-colors">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="urgent"
                                            checked={formData.urgent}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 focus:ring-2 focus:ring-offset-0"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <span className="font-bold text-red-800 block">Mark as Urgent</span>
                                        <span className="text-red-700/80">This project requires immediate attention. It will be highlighted to experts.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/dashboard" className="px-6 py-3 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || success}
                            className={`px-8 py-3 bg-slate-900 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2 ${(isSubmitting || success) ? 'opacity-70 cursor-not-allowed transform-none' : ''
                                }`}
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : success ? (
                                <>Posted!</>
                            ) : (
                                <>Post Project <ChevronLeft className="w-5 h-5 rotate-180" /></>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
