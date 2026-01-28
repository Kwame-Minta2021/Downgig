'use client';

import Header from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { UserPlus, Search, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowToFindWorkPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />

            {/* Hero */}
            <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/20 via-slate-900 to-slate-900"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl font-serif font-bold mb-6">Showcase Your Skills. Earn What You Deserve.</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Join a network of academic experts and work on challenging projects from around the globe.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-500 font-bold px-8 rounded-full">
                            Join as Talent
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Steps */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">1. Create Your Profile</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Highlight your academic achievements, skills, and portfolio. Stand out to potential clients.
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">2. Find Work</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Search for projects that match your expertise. Submit compelling proposals to win contracts.
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">3. Get Paid Securely</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Deliver quality work and receive payments directly to your wallet. Build your reputation and earn more.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white py-24 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Start your journey today.</h2>
                    <div className="flex justify-center gap-6">
                        <Link href="/projects">
                            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:border-slate-800 px-8 rounded-full">
                                Browse Opportunities <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
