'use client';


import { Quote } from 'lucide-react';
import Image from 'next/image';

export default function SuccessStoriesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">


            <section className="bg-slate-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-serif font-bold mb-6">Real Results. Real Impact.</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        See how students and businesses are achieving their goals with DownGigs.
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <StoryCard
                        name="Sarah Chen"
                        role="PhD Candidate at MIT"
                        title="Accelerated Research by Months"
                        quote="I was stuck on a complex data analysis problem for my thesis. Within 24 hours of posting on DownGigs, I found a developer who optimized my Python scripts, saving me months of computation time."
                        image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
                    />
                    <StoryCard
                        name="James Wilson"
                        role="Founder of EdTech Startup"
                        title="Built an MVP in Record Time"
                        quote="We needed a prototype built fast to show investors. The talent on DownGigs is unmatched. They understood our academic-focused requirements immediately and delivered a polished product."
                        image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                    />
                    <StoryCard
                        name="Dr. Emily Carter"
                        role="Professor at Stanford"
                        title="Found Specialized Assistance"
                        quote="Finding research assistants with specific niche knowledge is hard. DownGigs made it effortless to connect with capable students who were eager to contribute."
                        image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop"
                    />
                    <StoryCard
                        name="Michael Brown"
                        role="CS Student"
                        title="Paid Tuition with Freelancing"
                        quote="DownGigs allowed me to use my coding skills to pay for my tuition. The projects are interesting and relevant to my major, unlike typical freelance work."
                        image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop"
                    />
                </div>
            </section>
        </div>
    );
}

function StoryCard({ name, role, title, quote, image }: { name: string, role: string, title: string, quote: string, image: string }) {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200 border border-slate-100 flex flex-col items-start gap-6 hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{name}</h3>
                    <p className="text-slate-500 text-sm">{role}</p>
                </div>
            </div>

            <div>
                <h4 className="text-xl font-bold text-amber-500 mb-2 ml-8">{title}</h4>
                <div className="relative">
                    <Quote className="absolute top-0 left-0 w-6 h-6 text-slate-200 -translate-y-2" />
                    <p className="text-slate-600 italic pl-8 leading-relaxed">"{quote}"</p>
                </div>
            </div>
        </div>
    );
}
