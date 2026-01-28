'use client';

import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import OnboardingForm from '@/components/OnboardingForm';
import { useEffect } from 'react';

export default function OnboardingPage() {
    const { currentUser } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            // If not developer, redirect to dashboard
            if (currentUser.role !== 'developer') {
                router.push('/dashboard');
            }
            // If already approved (and presumably set up), redirect
            // Note: We might want an "Edit Profile" page later, this is for initial onboarding
            // if (currentUser.status === 'approved') {
            //     router.push('/dashboard');
            // }
        } else {
            router.push('/login');
        }
    }, [currentUser, router]);

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Header />
            <div className="pt-12 pb-20 px-4">
                <OnboardingForm />
            </div>
        </div>
    );
}
