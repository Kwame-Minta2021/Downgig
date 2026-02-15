'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';

import { Send, User, Search, Phone, Video, MoreVertical, Calendar } from 'lucide-react';
import ScheduleMeetingModal from '@/components/ScheduleMeetingModal';
import { UserAvatar } from '@/components/UserAvatar';

export default function MessagesPage() {
    const { currentUser, users, messages, sendMessage } = useApp();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser) router.push('/login');
    }, [currentUser, router]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedUserId]);

    if (!currentUser) return null;

    // Filter users based on Managed Network rules
    // Admins can see everyone.
    // Clients/Developers can ONLY see Admins.
    const eligibleConversationPartners = currentUser.role === 'admin'
        ? users
        : users.filter(u => u.role === 'admin');

    // Get unique conversation partners from existing messages
    const existingPartners = Array.from(new Set([
        ...messages.filter(m => m.senderId === currentUser.id).map(m => m.receiverId),
        ...messages.filter(m => m.receiverId === currentUser.id).map(m => m.senderId)
    ])).map(id => users.find(u => u.id === id)).filter((u): u is typeof users[0] => !!u);

    // Merge: Show existing partners (if any, preserving history) AND eligible new partners (Admins)
    // For non-admins, if they have history with non-admins (legacy), we might still show it or hide it.
    // For strict enforcement, we filter existingPartners too, but let's be lenient for legacy data visibility.
    // Actually, let's enforce: NON-ADMINs should only see ADMINs in the list to start new chats.

    const displayUsers = currentUser.role === 'admin'
        ? (existingPartners.length > 0 ? existingPartners : users.filter(u => u.id !== currentUser.id).slice(0, 10))
        : eligibleConversationPartners;

    // Filter users by search term
    const filteredUsers = displayUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.role === 'admin' && 'support'.includes(searchTerm.toLowerCase())) // Allow searching for "Support" to find admins
    );

    const selectedUser = users.find(u => u.id === selectedUserId);

    // Get messages for selected conversation
    const currentMessages = selectedUserId ? messages.filter(m =>
        (m.senderId === currentUser.id && m.receiverId === selectedUserId) ||
        (m.receiverId === currentUser.id && m.senderId === selectedUserId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [];

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !newMessage.trim()) return;

        await sendMessage(selectedUserId, newMessage);
        setNewMessage('');
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">


            <div className="flex-1 max-w-7xl w-full mx-auto p-4 flex gap-6 h-[calc(100vh-80px)]">
                {/* Sidebar */}
                <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hidden md:flex">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-xl mb-4 text-slate-900">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredUsers.map(user => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUserId(user.id)}
                                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${selectedUserId === user.id
                                    ? 'bg-blue-50 border-blue-100 shadow-sm'
                                    : 'hover:bg-slate-50 border border-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <UserAvatar user={user} size="md" />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className={`font-medium truncate ${selectedUserId === user.id ? 'text-blue-900' : 'text-slate-900'}`}>{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.university}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10">
                                <div className="flex items-center gap-3">
                                    <UserAvatar user={selectedUser} size="md" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-xs text-slate-500">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsMeetingModalOpen(true)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                                        title="Schedule Meeting"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-sm font-medium hidden sm:inline">Schedule</span>
                                    </button>
                                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Video className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                                {currentMessages.length > 0 ? (
                                    currentMessages.map(msg => {
                                        const isLink = msg.content.startsWith('http');
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.senderId === currentUser.id
                                                        ? 'bg-blue-600 text-white rounded-br-none'
                                                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap leading-relaxed">
                                                        {isLink ? (
                                                            <a href={msg.content} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 break-all">
                                                                {msg.content}
                                                            </a>
                                                        ) : msg.content}
                                                    </p>
                                                    <p className={`text-[10px] mt-1.5 text-right opacity-70 ${msg.senderId === currentUser.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                        <div className="text-4xl mb-2">👋</div>
                                        <p>Say hello to start the conversation!</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>

                            <ScheduleMeetingModal
                                isOpen={isMeetingModalOpen}
                                onClose={() => setIsMeetingModalOpen(false)}
                                attendeeId={selectedUser.id}
                                attendeeName={selectedUser.name}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Select a conversation</h3>
                            <p className="max-w-xs text-center">Choose a user from the sidebar to start chatting or schedule a meeting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
