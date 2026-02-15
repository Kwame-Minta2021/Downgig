'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Shield, Users, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DevelopersPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-slate-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center rounded-b-[3rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 blur-3xl rounded-full translate-x-1/2"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight px-4">
                        Access <span className="text-amber-500">Vetted</span> Technical Talent
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        We don't expose our developers to the open market. We manage an exclusive network of top student engineers and researchers ready to build your next project.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/projects/new">
                            <Button size="lg" className="rounded-full px-8 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold border-none text-lg h-14">
                                Start a Project
                            </Button>
                        </Link>
                        <a href="mailto:frederickminta@gmail.com">
                            <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-700 text-white hover:bg-white/10 font-bold text-lg h-14">
                                Schedule Consultation
                            </Button>
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Value Props */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Private Network</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Our talent pool is curated and private. We match you with the right skills based on your project needs, ensuring confidentiality and quality.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Managed Delivery</h3>
                        <p className="text-slate-600 leading-relaxed">
                            You don't just hire a freelancer; you get a managed service. We oversee the development process from start to finish.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <CheckCircle className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Guaranteed Results</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Payments are held in escrow and only released when milestones are met. Your satisfaction is our priority.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
