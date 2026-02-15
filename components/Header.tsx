'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import { Bell } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { currentUser, signOut } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut();
        // AppContext handles redirect
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'bg-transparent border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity z-50">
                        <Logo className="w-10 h-10" textClassName="text-2xl" />
                    </Link>

                    {/* Desktop Navigation */}
                    {currentUser ? (
                        <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl backdrop-blur-sm border border-slate-200/50">
                            <NavLink href="/projects" active={isActive('/projects')}>Browse</NavLink>
                            {currentUser.role === 'client' && (
                                <NavLink href="/projects/new" active={isActive('/projects/new')}>Post Project</NavLink>
                            )}
                            {currentUser.role === 'admin' && (
                                <NavLink href="/admin" active={isActive('/admin')}>Admin</NavLink>
                            )}
                            <NavLink href="/my-jobs" active={isActive('/my-jobs')}>My Jobs</NavLink>
                            <NavLink href="/messages" active={isActive('/messages')}>Messages</NavLink>
                            <NavLink href="/saved-jobs" active={isActive('/saved-jobs')}>Saved</NavLink>
                        </nav>
                    ) : (
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                How it Works
                            </Link>
                            <Link href="/developers" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Find Talent
                            </Link>
                        </nav>
                    )}

                    {/* Desktop User Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                                <Link href="/profile" className="flex items-center gap-3 group px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-slate-900 leading-none">{currentUser.name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{currentUser.role === 'client' ? 'Client' : 'Developer'}</p>
                                    </div>
                                    <div className="group-hover:scale-110 transition-transform">
                                        <UserAvatar user={currentUser} size="md" />
                                    </div>
                                </Link>
                                <Button
                                    onClick={handleSignOut}
                                    variant="ghost"
                                    size="sm"
                                    disabled={isSigningOut}
                                    className="hidden sm:flex disabled:opacity-50"
                                >
                                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-3 py-1.5 text-xs font-medium bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all duration-200"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30 border border-transparent font-bold tracking-wide rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        {currentUser && <NotificationDropdown />}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-50 relative"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between">
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-current rounded-full origin-center"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="w-full h-0.5 bg-current rounded-full"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-current rounded-full origin-center"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col pt-24 pb-8 px-6 overflow-y-auto"
                        >
                            {/* Mobile User Info */}
                            {currentUser ? (
                                <div className="flex flex-col gap-6 mb-8">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <UserAvatar user={currentUser} size="lg" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">{currentUser.name}</p>
                                            <p className="text-sm text-slate-500 capitalize">{currentUser.role === 'client' ? 'Client' : 'Developer'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <MobileNavLink href="/profile" active={isActive('/profile')} onClick={() => setMobileMenuOpen(false)}>
                                            My Profile
                                        </MobileNavLink>
                                        <MobileNavLink href="/projects" active={isActive('/projects')} onClick={() => setMobileMenuOpen(false)}>
                                            Browse Projects
                                        </MobileNavLink>
                                        {currentUser.role === 'client' && (
                                            <MobileNavLink href="/projects/new" active={isActive('/projects/new')} onClick={() => setMobileMenuOpen(false)}>
                                                Post Project
                                            </MobileNavLink>
                                        )}
                                        {currentUser.role === 'admin' && (
                                            <MobileNavLink href="/admin" active={isActive('/admin')} onClick={() => setMobileMenuOpen(false)}>
                                                Admin Dashboard
                                            </MobileNavLink>
                                        )}
                                        <MobileNavLink href="/my-jobs" active={isActive('/my-jobs')} onClick={() => setMobileMenuOpen(false)}>
                                            My Jobs
                                        </MobileNavLink>
                                        <MobileNavLink href="/messages" active={isActive('/messages')} onClick={() => setMobileMenuOpen(false)}>
                                            Messages
                                        </MobileNavLink>
                                        <MobileNavLink href="/saved-jobs" active={isActive('/saved-jobs')} onClick={() => setMobileMenuOpen(false)}>
                                            Saved Jobs
                                        </MobileNavLink>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-slate-100">
                                        <Button
                                            onClick={() => {
                                                console.log('Mobile Menu: Sign Out clicked');
                                                handleSignOut();
                                                setMobileMenuOpen(false);
                                            }}
                                            variant="ghost"
                                            disabled={isSigningOut}
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="space-y-4 mb-8">
                                        <MobileNavLink href="/about" active={isActive('/about')} onClick={() => setMobileMenuOpen(false)}>
                                            How it Works
                                        </MobileNavLink>
                                        <MobileNavLink href="/developers" active={isActive('/developers')} onClick={() => setMobileMenuOpen(false)}>
                                            Find Talent
                                        </MobileNavLink>
                                    </div>
                                    <div className=" pt-8 border-t border-slate-100 flex flex-col gap-4">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full justify-start px-8 py-4 text-base font-semibold bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all duration-200 inline-flex items-center"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full shadow-lg shadow-blue-500/25 px-8 py-4 text-base font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30 border border-transparent tracking-wide rounded-xl transition-all duration-200 inline-flex items-center justify-center"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

function MobileNavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode, onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${active
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            {children}
        </Link>
    );
}

function NotificationDropdown() {
    const { notifications, markNotificationRead } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                        >
                            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            onClick={() => {
                                                markNotificationRead(notification.id);
                                            }}
                                            className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <p className={`text-sm mb-1 ${!notification.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                                                {notification.content}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(notification.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        No notifications yet.
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t border-slate-50 bg-slate-50/50">
                                <Link href="/my-jobs" className="block text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-2">
                                    View All Activity
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`relative px-5 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${active ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
        >
            {children}
        </Link>
    );
}
