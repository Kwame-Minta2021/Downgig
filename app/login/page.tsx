'use client';
// Force rebuild

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const { signIn, currentUser } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            router.push('/dashboard');
        }
    }, [currentUser, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { error } = await signIn(email, password);
            if (!error) {
                router.push('/dashboard');
            } else {
                console.error('Login error:', error);
                // Handle various Supabase error formats
                const errorMsg = error.message || error.error_description || 'An unexpected error occurred';

                if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('Invalid credentials')) {
                    setError('Invalid email or password. Please check your credentials.');
                } else if (errorMsg.includes('Email not confirmed')) {
                    setError('Please verify your email address. Check your inbox for the confirmation link.');
                } else {
                    setError(errorMsg);
                }
                setIsLoading(false);
            }
        } catch (err) {
            setError('An unexpected network error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            {/* Ambient background effects - Premium Gold/Blue */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[150px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-md border border-white/10 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold text-2xl mx-auto mb-4 shadow-lg shadow-amber-500/20">
                        D
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400">Sign in to your account</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0 text-red-500">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@university.edu"
                            required
                            disabled={isLoading}
                            className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 disabled:opacity-50"
                        />
                    </div>

                    <div className="relative space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            disabled={isLoading}
                            className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 disabled:opacity-50"
                        />
                        <a href="#" className="text-xs text-amber-500 hover:text-amber-400 font-medium absolute right-0 top-0">
                            Forgot password?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isLoading}
                        className="w-full text-lg shadow-lg shadow-amber-900/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 border-none disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                Signing In...
                            </div>
                        ) : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-amber-500 font-bold hover:text-amber-400 transition-colors">
                        Sign Up
                    </Link>
                </p>


            </motion.div>
        </div>
    );
}
