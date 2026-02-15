'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

import ProjectCard from '@/components/ProjectCard'; // No onClick prop in Card
import CategoriesCarousel from '@/components/CategoriesCarousel';
import { Button } from '@/components/ui/Button';
import { Search, Shield, Zap, Award, CheckCircle, ArrowRight, UserCheck, Code, Globe, PenTool, ClipboardList, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

import BackgroundSlideshow from '@/components/BackgroundSlideshow'; // Import at the top

export default function HomePage() {
  const router = useRouter();
  const { currentUser, projects } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const slideImages = [
    '/hero-slides/slide1.png',
    '/hero-slides/slide2.png',
    '/hero-slides/slide3.png',
  ];

  // Keep protected mainly for app-like fee, but standard landing page usually public.
  // The logic in previous steps redirected if not logged in. 
  // For a "Landing Page", we might want it accessible. 
  // But adhering to previous logic:
  useEffect(() => {
    // if (!currentUser) {
    //   router.push('/login'); 
    // }
  }, [currentUser, router]);

  const recentProjects = projects.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/projects?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">


      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] min-h-[60dvh] flex flex-col justify-center">
        {/* Slideshow Background */}
        <BackgroundSlideshow images={slideImages} duration={6} />

        {/* Content Container - Ensure relative z-index to sit on top */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight mb-6 md:mb-8 leading-tight">
              Engineering Delivered. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Not Just Promised.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-light px-4">
              We don't just find you developers—we build your software. DownGigs recruits, manages, and guarantees the work of top technical talent so you can focus on growing your business.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <Link
              href="/projects/new"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold border-none transition-all hover:scale-105 active:scale-95 text-lg h-14 w-full sm:w-auto shadow-lg shadow-amber-500/30"
            >
              Start a Project
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 border-2 border-white/20 text-white hover:bg-white/10 font-bold transition-all hover:scale-105 active:scale-95 text-lg h-14 w-full sm:w-auto backdrop-blur-sm"
            >
              Join Delivery Network
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium uppercase tracking-widest"
          >
            <span>Managed Delivery For</span>
            <span className="text-slate-300">Startups</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">SMEs</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Enterprise</span>
          </motion.div>
        </div>
      </section>

      {/* Category Carousel Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Comprehensive Technical Capabilities</h2>
          <p className="text-slate-500 text-lg">Scalable solutions across every domain.</p>
        </div>

        <CategoriesCarousel categories={[
          { name: 'Web Dev', icon: <Code className="w-8 h-8" />, color: "text-blue-500" },
          { name: 'Mobile Apps', icon: <Zap className="w-8 h-8" />, color: "text-amber-500" },
          { name: 'Backend & API', icon: <Globe className="w-8 h-8" />, color: "text-rose-500" },
          { name: 'UI/UX Design', icon: <PenTool className="w-8 h-8" />, color: "text-emerald-500" },
          { name: 'Data & Auto', icon: <ClipboardList className="w-8 h-8" />, color: "text-indigo-500" },
          { name: 'Maintenance', icon: <Shield className="w-8 h-8" />, color: "text-slate-500" },
        ]} />
      </section>

      {/* Value Props / Why Choose Us */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/30 skew-x-12 translate-x-32" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <span className="text-amber-500 font-bold tracking-wider uppercase mb-2 block text-sm">The Managed Difference</span>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Why businesses choose Managed Delivery
            </h2>
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20">
                  <Award className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">End-to-End Management</h3>
                  <p className="text-slate-600 leading-relaxed">We scope, assign, and manage the work. You get the results. No more herding freelancers.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Vetted Technical Excellence</h3>
                  <p className="text-slate-600 leading-relaxed">Access a private network of skilled developers, fully tested and backed by our quality assurance.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Shield className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Zero Overhead</h3>
                  <p className="text-slate-600 leading-relaxed">No interviewing, no payroll, no direct management. Just specify your needs, and we deliver.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 rounded-[2rem] rotate-3 opacity-20 blur-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Managed Team"
              className="relative rounded-[2rem] shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700 border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - New */}
      <section className="py-24 max-w-7xl mx-auto px-4 bg-slate-50">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold uppercase tracking-wider text-sm mb-2 block">The Process</span>
          <h2 className="text-4xl font-serif font-bold text-slate-900">Your Vision, Our Execution</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Submit Request', desc: 'Tell us what you need. Whether it\'s a new feature or full app.' },
            { step: '02', title: 'Scoping & Plan', desc: 'Our PMs review requirements and define a clear scope and budget.' },
            { step: '03', title: 'Development', desc: 'We assign the best-fit talent. Work begins immediately.' },
            { step: '04', title: 'Review & Launch', desc: 'You review the final deliverables. We deploy upon approval.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <span className="text-6xl font-black text-slate-100 absolute -top-2 -right-2 group-hover:text-amber-50 transition-colors">{item.step}</span>
              <div className="relative z-10">
                <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer - Premium Dark */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-5xl font-serif font-bold mb-8">Ready to build?</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop gambling on gig marketplaces. Partner with a managed delivery network.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/projects/new"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 bg-amber-500 text-slate-900 hover:bg-amber-400 border-none shadow-xl shadow-amber-900/20 text-lg font-bold h-14 transition-all duration-200"
            >
              Start a New Project
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 border-2 border-slate-700 text-white hover:bg-white/5 text-lg font-medium h-14 transition-all duration-200"
            >
              Developer Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


