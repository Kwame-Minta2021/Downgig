import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                {/* Brand Column */}
                <div className="lg:col-span-1 space-y-4">
                    <Link href="/">
                        <Logo className="w-10 h-10" textClassName="text-2xl text-white" />
                    </Link>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Connecting academic excellence with expert development.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                        <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
                        <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                    </div>
                </div>

                {/* For Clients */}
                <div>
                    <h3 className="text-white font-bold mb-4">For Clients</h3>
                    <ul className="space-y-3 text-sm">
                        <FooterLink href="/how-to-hire">How to Hire</FooterLink>
                        <FooterLink href="/developers">Talent Marketplace</FooterLink>
                        <FooterLink href="/projects">Project Catalog</FooterLink>
                        <li>
                            <a href="mailto:frederickminta@gmail.com" className="hover:text-amber-500 transition-colors">
                                Schedule Consultation
                            </a>
                        </li>
                    </ul>
                </div>

                {/* For Talent */}
                <div>
                    <h3 className="text-white font-bold mb-4">For Talent</h3>
                    <ul className="space-y-3 text-sm">
                        <FooterLink href="/how-to-find-work">How to Find Work</FooterLink>
                        <FooterLink href="/projects">Direct Contracts</FooterLink>
                        <FooterLink href="/projects">Find Opportunity</FooterLink>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-white font-bold mb-4">Resources</h3>
                    <ul className="space-y-3 text-sm">
                        <FooterLink href="/support">Help & Support</FooterLink>
                        <FooterLink href="/success-stories">Success Stories</FooterLink>
                        <FooterLink href="/reviews">DownGigs Reviews</FooterLink>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-white font-bold mb-4">Company</h3>
                    <ul className="space-y-3 text-sm">
                        <FooterLink href="/about">About Us</FooterLink>
                        <FooterLink href="/leadership">Leadership</FooterLink>
                        <FooterLink href="/careers">Careers</FooterLink>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <p>&copy; 2026 DownGigs. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-amber-500 transition-colors">
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a href={href} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition-all">
            {icon}
        </a>
    );
}
