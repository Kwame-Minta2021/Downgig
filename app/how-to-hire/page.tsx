'use client';

import Header from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Search, CheckCircle, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowToHirePage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />

            {/* Hero */}
            <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900 to-slate-900"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl font-serif font-bold mb-6">Find the perfect expert for your project.</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        DownGigs connects you with top-tier academic talent. Here is how easy it is to get started.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-bold px-8 rounded-full">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Steps */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">1. Post a Job</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Tell us what you need. Provide details about your project, budget, and timeline. It is free to post!
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">2. Choose an Expert</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Get proposals from vetted developers. Review their profiles, ratings, and portfolios before hiring.
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">3. Secure Payment</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Funds are held safely in escrow until you are 100% satisfied with the work delivered.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white py-24 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Ready to transform your workflow?</h2>
                    <div className="flex justify-center gap-6">
                        <Link href="/projects/new">
                            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 px-8 rounded-full">
                                Post a Project Now <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
