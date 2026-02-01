'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
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
      <Header />

      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem]">
        {/* Slideshow Background */}
        <BackgroundSlideshow images={slideImages} duration={6} />

        {/* Content Container - Ensure relative z-index to sit on top */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight mb-6 md:mb-8 leading-tight">
              Elite Talent. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Instant Access.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-light">
              Connect with the world's most capable academic developers. <br className="hidden md:block" />
              A marketplace redefined for excellence.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-full p-2 flex shadow-2xl shadow-black/20 mb-12 border border-white/10"
          >
            <div className="flex-1 flex items-center px-4 md:px-6">
              <Search className="w-6 h-6 text-amber-500 mr-3" />
              <input
                type="text"
                placeholder="Find experts in..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 text-lg font-medium"
              />
            </div>
            <Button size="lg" className="rounded-full px-8 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold border-none transition-all hover:scale-105 active:scale-95">
              Search
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium uppercase tracking-widest"
          >
            <span>Trusted By Leaders In</span>
            <span className="text-slate-300">Tech</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Finance</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Research</span>
          </motion.div>
        </div>
      </section>

      {/* Category Carousel Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Curated Categories</h2>
          <p className="text-slate-500 text-lg">Precision-matched expertise for every domain.</p>
        </div>

        <CategoriesCarousel categories={[
          { name: 'Development', icon: <Code className="w-8 h-8" />, color: "text-blue-500" },
          { name: 'AI Services', icon: <Zap className="w-8 h-8" />, color: "text-amber-500" },
          { name: 'Design', icon: <PenTool className="w-8 h-8" />, color: "text-rose-500" },
          { name: 'Business', icon: <ArrowRight className="w-8 h-8" />, color: "text-emerald-500" },
          { name: 'Admin', icon: <UserCheck className="w-8 h-8" />, color: "text-indigo-500" },
          { name: 'Legal', icon: <Shield className="w-8 h-8" />, color: "text-slate-500" },
          { name: 'Web3', icon: <Globe className="w-8 h-8" />, color: "text-cyan-500" },
          { name: 'Finance', icon: <DollarSign className="w-8 h-8" />, color: "text-green-600" },
        ]} />
      </section>

      {/* Value Props / Why Choose Us */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/30 skew-x-12 translate-x-32" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <span className="text-amber-500 font-bold tracking-wider uppercase mb-2 block text-sm">The DownGigs Standard</span>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Why businesses turn to DownGigs
            </h2>
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20">
                  <Award className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Vetted for Brilliance</h3>
                  <p className="text-slate-600 leading-relaxed">We verify every credential. You hire only the top 1% of academic talent, pre-screened for your needs.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Shield className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Ironclad Security</h3>
                  <p className="text-slate-600 leading-relaxed">Enterprise-grade protection for your data and payments. Your peace of mind is our priority.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Satisfaction Guaranteed</h3>
                  <p className="text-slate-600 leading-relaxed">Funds are only released when you are 100% satisfied with the work delivered.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 rounded-[2rem] rotate-3 opacity-20 blur-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
              alt="Premium Collaboration"
              className="relative rounded-[2rem] shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700 border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12 md:mb-16">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-4 text-slate-900">Featured Opportunities</h2>
            <p className="text-xl text-slate-500">The latest high-value projects.</p>
          </div>
          <Link href="/projects" className="hidden md:inline-flex items-center font-bold text-amber-600 hover:text-amber-700 border-b-2 border-transparent hover:border-amber-600 transition-all">
            View All Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="flex justify-center mb-6">
              <ClipboardList className="w-16 h-16 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No active projects</h3>
            <p className="text-slate-500 mb-8">Be the first to post a new opportunity.</p>
            <Link href="/projects/new">
              <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8">
                Post a Project
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* CTA Footer - Premium Dark */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-5xl font-serif font-bold mb-8">Transform your workflow.</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the elite network of professionals who have chosen DownGigs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 border-none shadow-xl shadow-amber-900/20 px-10 h-14 text-lg font-bold rounded-full">
                Get Started
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-white/5 px-10 h-14 text-lg font-medium rounded-full">
                Browse Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Links - Removed (Using Global Footer) */}
    </div>
  );
}
