'use client';
// Force rebuild

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { GraduationCap, Code, ArrowRight } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const { signUp, currentUser } = useApp();

    useEffect(() => {
        if (currentUser) {
            router.push('/dashboard');
        }
    }, [currentUser, router]);

    const [step, setStep] = useState<1 | 2>(1);
    const [role, setRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
    });
    const [error, setError] = useState('');
    const [isVerificationSent, setIsVerificationSent] = useState(false);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) return;

        const { error } = await signUp({
            ...formData,
            role,
            avatar: role === 'client' ? '🎓' : '💻',
            password: formData.password
        });

        if (!error) {
            setIsVerificationSent(true);
        } else {
            console.error(error);
            if (error.message?.includes('Database error')) {
                setError('Setup Error: Please run the provided supabase_schema.sql in your Supabase SQL Editor to create the necessary tables and triggers.');
            } else {
                setError(error.message || 'Failed to create account.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-2xl font-serif font-bold text-white tracking-tight">
                                Down<span className="text-amber-500">Gigs</span>
                            </span>
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-white mb-3">
                            {step === 1 ? 'Choose your path' : 'Create your account'}
                        </h1>
                        <p className="text-slate-400">
                            {step === 1
                                ? 'Join the elite marketplace for academic excellence.'
                                : `Joining as a ${role === 'client' ? 'Client' : 'Developer'}`}
                        </p>
                    </div>

                    {isVerificationSent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                <div className="w-10 h-10 text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                                We've sent a verification link to <span className="text-white font-medium">{formData.email}</span>.
                                Please check your inbox to activate your account.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-xl"
                                >
                                    Proceed to Login
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsVerificationSent(false)}
                                    className="text-slate-500 hover:text-white"
                                >
                                    Use a different email
                                </Button>
                            </div>
                        </motion.div>
                    ) : step === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleSelect('client')}
                                className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 text-left transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-900/10"
                            >
                                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-900 transition-colors">
                                    <GraduationCap className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">I need expertise</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Hire top-tier developers for your academic projects.
                                </p>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleSelect('developer')}
                                className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 text-left transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10"
                            >
                                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-blue-500 text-slate-400 group-hover:text-slate-900 transition-colors">
                                    <Code className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">I want to work</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Showcase your skills and earn by solving complex problems.
                                </p>
                            </motion.button>
                        </div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-6 max-w-md mx-auto"
                        >
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        required
                                        className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">University</label>
                                    <Input
                                        value={formData.university}
                                        onChange={e => setFormData({ ...formData, university: e.target.value })}
                                        placeholder="Stanford"
                                        required
                                        className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email Address</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.edu"
                                    required
                                    className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="px-6 text-slate-400 hover:text-white"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="flex-1 bg-amber-500 text-slate-900 hover:bg-amber-400 font-bold rounded-xl"
                                >
                                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.form>
                    )}

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-amber-500 font-bold hover:text-amber-400 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
