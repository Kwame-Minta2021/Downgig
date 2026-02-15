'use client';


import { Button } from '@/components/ui/Button';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">


            <section className="bg-slate-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-serif font-bold mb-6">Join the Mission</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Build the platform that powers the next generation of academic discovery.
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-5xl mx-auto px-4">

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Open Positions</h2>
                    <div className="space-y-6">
                        <JobCard
                            title="Senior Full Stack Engineer"
                            department="Engineering"
                            location="Remote"
                            type="Full-time"
                        />
                        <JobCard
                            title="Product Designer"
                            department="Design"
                            location="Remote"
                            type="Full-time"
                        />
                        <JobCard
                            title="Marketing Manager"
                            department="Marketing"
                            location="Remote"
                            type="Full-time"
                        />
                        <JobCard
                            title="Customer Success Specialist"
                            department="Operations"
                            location="Remote"
                            type="Full-time"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">Don't see your role?</h2>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                            We are always looking for exceptional talent. Send us your resume and tell us how you can make an impact.
                        </p>
                        <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-bold px-8 rounded-xl">
                            Email Us
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function JobCard({ title, department, location, type }: { title: string, department: string, location: string, type: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-500/50 transition-colors flex justify-between items-center group cursor-pointer">
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{title}</h3>
                <div className="flex gap-4 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{department}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {type}</span>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-50 text-slate-400 group-hover:text-amber-600 transition-colors">
                <ArrowRight className="w-5 h-5" />
            </div>
        </div>
    );
}
