'use client';

import Header from '@/components/Header';
import { Star } from 'lucide-react';

export default function ReviewsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />

            <section className="bg-slate-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex justify-center gap-2 mb-6 text-amber-500">
                        <Star className="w-8 h-8 fill-current" />
                        <Star className="w-8 h-8 fill-current" />
                        <Star className="w-8 h-8 fill-current" />
                        <Star className="w-8 h-8 fill-current" />
                        <Star className="w-8 h-8 fill-current" />
                    </div>
                    <h1 className="text-5xl font-serif font-bold mb-6">Trusted by Thousands.</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        See what our community has to say about their experience.
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Reviews */}
                    <ReviewCard
                        name="Alice M."
                        rating={5}
                        date="2 days ago"
                        text="Absolutely game changing. I found a developer for my project in under 2 hours. The quality of work was exceptional."
                    />
                    <ReviewCard
                        name="David K."
                        rating={5}
                        date="1 week ago"
                        text="The platform is intuitive and secure. I felt safe sending payments through their escrow system. Highly recommended."
                    />
                    <ReviewCard
                        name="Sophia L."
                        rating={4}
                        date="2 weeks ago"
                        text="Great pool of talent. The verification process gives me confidence that I am hiring real students from top universities."
                    />
                    <ReviewCard
                        name="Robert T."
                        rating={5}
                        date="3 weeks ago"
                        text="As a developer, this is the best platform I have used. Fair rates and interesting projects. No spam."
                    />
                    <ReviewCard
                        name="Jennifer W."
                        rating={5}
                        date="1 month ago"
                        text="Support team was super helpful when I had a question about billing. Quick resolution."
                    />
                    <ReviewCard
                        name="Marcus G."
                        rating={5}
                        date="1 month ago"
                        text="The user interface is beautiful and easy to navigate. Posting a job was a breeze."
                    />
                </div>
            </section>
        </div>
    );
}

function ReviewCard({ name, rating, date, text }: { name: string, rating: number, date: string, text: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-900">{name}</h3>
                    <p className="text-xs text-slate-400">{date}</p>
                </div>
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                    ))}
                </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">"{text}"</p>
        </div>
    );
}
