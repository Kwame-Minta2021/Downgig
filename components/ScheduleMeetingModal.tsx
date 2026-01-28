'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { X, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    attendeeId: string;
    attendeeName: string;
}

export default function ScheduleMeetingModal({ isOpen, onClose, attendeeId, attendeeName }: ScheduleMeetingModalProps) {
    const { scheduleMeeting, currentUser } = useApp();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(30);

    if (!currentUser) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine date and time
        const startTime = new Date(`${date}T${time}`).toISOString();

        scheduleMeeting({
            hostId: currentUser.id,
            hostName: currentUser.name,
            attendeeId,
            attendeeName,
            title: title || `Meeting with ${attendeeName}`,
            startTime,
            durationMinutes: duration,
            link: `https://meet.google.com/${Math.random().toString(36).substring(7)}` // Mock link
        });

        onClose();
        alert(`Meeting scheduled with ${attendeeName}!`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md pointer-events-auto"
                        >
                            <Card className="relative overflow-visible">
                                <button
                                    onClick={onClose}
                                    className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg text-slate-500 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">Schedule Meeting</h2>
                                    <p className="text-sm text-slate-500">Book a time with {attendeeName}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Project Sync"
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="date"
                                                    required
                                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={date}
                                                    onChange={e => setDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="time"
                                                    required
                                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={time}
                                                    onChange={e => setTime(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                                        <div className="flex gap-2">
                                            {[15, 30, 45, 60].map(mins => (
                                                <button
                                                    key={mins}
                                                    type="button"
                                                    onClick={() => setDuration(mins)}
                                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${duration === mins
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {mins}m
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" className="w-full justify-center">
                                            Confirm Booking
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
