'use client';

import Header from '@/components/Header';
import { Linkedin, Twitter } from 'lucide-react';

export default function LeadershipPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />

            <section className="bg-slate-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-serif font-bold mb-6">Our Leadership</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Meet the visionaries behind DownGigs who are dedicated to reshaping the future of academic collaboration.
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    <LeaderCard
                        name="Alex Sterling"
                        role="CEO & Co-Founder"
                        image="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
                        bio="Former academic researcher and tech entrepreneur. Alex founded DownGigs to bridge the gap between universities and the industry."
                    />

                    <LeaderCard
                        name="Dr. Eleanor Rigby"
                        role="Chief Academic Officer"
                        image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop"
                        bio="With 15 years as a professor at Harvard, Eleanor ensures our platform maintains the highest standards of academic integrity."
                    />

                    <LeaderCard
                        name="Marcus Thorne"
                        role="CTO"
                        image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop"
                        bio="A veteran systems architect who has built scalable platforms for major tech companies. He leads our engineering team."
                    />
                    <LeaderCard
                        name="Sarah Jenkins"
                        role="Head of Product"
                        image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
                        bio="Sarah ensures that our users maximize their productivity with intuitive design and seamless workflows."
                    />
                    <LeaderCard
                        name="David Chen"
                        role="VP of Operations"
                        image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                        bio="David oversees our global operations, ensuring that both clients and talent have a smooth experience."
                    />
                    <LeaderCard
                        name="Olivia Martinez"
                        role="Head of Community"
                        image="https://images.unsplash.com/photo-1598550874175-4d7112ee7f38?q=80&w=2070&auto=format&fit=crop"
                        bio="Olivia fosters our vibrant community of students and researchers, connecting them with opportunities."
                    />

                </div>
            </section>
        </div>
    );
}

function LeaderCard({ name, role, image, bio }: { name: string, role: string, image: string, bio: string }) {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
            <div className="h-64 overflow-hidden">
                <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">{name}</h3>
                <p className="text-amber-600 font-medium mb-4">{role}</p>
                <p className="text-slate-500 leading-relaxed mb-6">{bio}</p>

                <div className="flex gap-4">
                    <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                        <Twitter className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
