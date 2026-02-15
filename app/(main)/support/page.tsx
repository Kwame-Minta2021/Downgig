'use client';


import { Button } from '@/components/ui/Button';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function SupportPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">


            <section className="bg-slate-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-serif font-bold mb-6">Here to help.</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Find answers to common questions or reach out to our support team.
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6">
                        <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Live Chat</h3>
                            <p className="text-slate-500 mb-4">Chat with our support team using the widget in the bottom right corner.</p>
                            <span className="text-amber-600 font-bold text-sm">Available Mon-Fri, 9am-5pm EST</span>
                        </div>
                    </div>

                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                            <Mail className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
                            <p className="text-slate-500 mb-4">Send us an email and we will get back to you within 24 hours.</p>
                            <a href="mailto:support@downgigs.com" className="text-blue-600 font-bold hover:underline">support@downgigs.com</a>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <HelpCircle className="w-8 h-8 text-slate-400" />
                        <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-6">
                        <FAQItem
                            question="Is DownGigs free to use?"
                            answer="Joining DownGigs and posting a project is free. We charge a small service fee on successful payments to cover platform costs."
                        />
                        <FAQItem
                            question="How are payments handled?"
                            answer="We use a secure escrow system. Clients fund the project upfront, but funds are only released to the developer once milestones are approved."
                        />
                        <FAQItem
                            question="What if I am not satisfied with the work?"
                            answer="We offer a dispute resolution center. If delivered work does not meet the agreed requirements, we can mediate to ensure a fair outcome, including refunds."
                        />
                        <FAQItem
                            question="How do I verify my account?"
                            answer="After signing up, you will receive an email with a verification link. Click the link to activate your full account features."
                        />
                    </div>
                </div>

            </section>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-2">{question}</h3>
            <p className="text-slate-500">{answer}</p>
        </div>
    );
}
