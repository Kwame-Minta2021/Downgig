'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <section className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                        Revolutionizing Academic Collaboration
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                        DownWork connects ambitious students with expert developers to turn complex academic requirements into high-quality software solutions.
                    </p>
                    <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                    <p className="text-slate-600">Simple, secure, and effective workflow</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                        <h3 className="text-xl font-bold mb-3">Post Your Project</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Describe your academic project requirements, timeline, and budget. The more details, the better the match.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                        <h3 className="text-xl font-bold mb-3">Review Proposals</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Receive bids from verified developers. Check their profiles, ratings, and past academic work experience.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                        <h3 className="text-xl font-bold mb-3">Collaborate & Succeed</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Work together using our secure platform. Release payment only when you are satisfied with the deliverables.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-slate-50 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Why Choose DownWork?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg h-fit text-blue-600"><Shield className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Academic Integrity</h3>
                                        <p className="text-slate-600">We prioritize code quality and documentation that meets academic standards.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-purple-100 p-3 rounded-lg h-fit text-purple-600"><Zap className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Fast Turnaround</h3>
                                        <p className="text-slate-600">Urgent deadlines? Our developers are ready to jump in and help you meet them.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-emerald-100 p-3 rounded-lg h-fit text-emerald-600"><CheckCircle className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Verified Experts</h3>
                                        <p className="text-slate-600">Every developer is vetted to ensure they have the technical skills required.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl transform rotate-3 opacity-20"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                                <div className="space-y-4">
                                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                    <div className="h-32 bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                                        Premium Code Quality
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <div className="h-10 bg-blue-600 rounded w-1/3 opacity-20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 text-center">
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8">Ready to start your project?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup" className="btn btn-primary text-lg px-8">
                        Create Free Account
                    </Link>
                    <Link href="/projects" className="btn btn-outline border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                        Browse Projects
                    </Link>
                </div>
            </section>

            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} DownWork. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
