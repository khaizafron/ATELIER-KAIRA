
"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, Fingerprint, History, Lock, Eye, Layers } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { MagneticButton } from '@/components/MagneticButton';
import Link from "next/link"

const ERAS = [
  {
    year: "1990s",
    title: "The Rebellion",
    desc: "A decade of radical silhouettes and velvet textures. The birth of the modern avant-garde.",
    img: "rebel.jpg"
  },
  {
    year: "2000s",
    title: "Power & Excess",
    desc: "Structural shoulders and opulent hardware. Defining the identity of global dominance.",
    img: "power.jpg"
  },
  {
    year: "2010s",
    title: "Minimalist Soul",
    desc: "The return to purity. Clean lines, monochromatic palettes, and the dawn of Japanese deconstruction.",
    img: "minimal.jpg"
  },
  {
    year: "2025s",
    title: "Y2K Archive",
    desc: "Experimental materials and the intersection of technology and street silhouette.",
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200"
  }
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: horizontalProgress } = useScroll({
    target: horizontalRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  
  // Hero Transforms
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
  const heroRadius = useTransform(smoothProgress, [0, 0.2], ["0rem", "5rem"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  // Horizontal Scroll Math
  const xTranslate = useTransform(horizontalProgress, [0.1, 0.9], ["0%", "-65%"]);

  return (
    <div ref={containerRef} className="relative bg-[#FDFCFB] text-[#1a1a1a]">
      {/* SECTION 1: EDITORIAL IMMERSION HERO */}
      <section className="sticky top-0 -mt-24 h-screen w-full overflow-hidden flex items-center justify-center z-10">

        <motion.div 
          style={{ 
            scale: heroScale,
            borderRadius: heroRadius,
            opacity: heroOpacity
          }}
          className="relative w-full h-full overflow-hidden"
        >
          <img 
            src="/aboutbg.jpg"
            className="w-full h-full object-cover grayscale-[0.3]"
            alt="Hero Archive"
          />
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-[#FDFCFB]/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-[10px] font-black uppercase tracking-[1em] text-black/40 mb-12"
            >
              The Ximy Manifesto
            </motion.div>
            <h1 className="text-[10vw] font-bold tracking-tighter leading-none mb-10 overflow-hidden text-black">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                THE ARCHIVE
              </motion.span>
            </h1>
            <p className="max-w-2xl text-xl text-black/60 font-light italic font-display leading-relaxed">
              Curating rare silhouettes and temporal artifacts <br /> for the discerning modern eye.
            </p>
          </div>
        </motion.div>
      </section>

      {/* SPACE FILLER FOR STICKY EFFECT */}
      <div className="h-[20vh]" />

      {/* SECTION 2: THE CURATORIAL ETHOS (CLEAN GRID) */}
      <section className="relative z-20 px-6 max-w-7xl mx-auto py-60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 text-amber-600">
                <div className="w-12 h-px bg-current" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em]">The Ethos</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-black">
                Design <br />
                <span className="italic font-display text-black/20">is Eternal.</span>
              </h2>
            </motion.div>

            <div className="space-y-10 text-xl text-black/50 font-light leading-relaxed">
              <p>We approach fashion as forensic historians. Every fiber in the Ximy Vault is traced to its origin, ensuring provenance and preservation of artistic intent.</p>
              <p>Our collection is a dialogue between the icons of the past and the pioneers of the future.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 rounded-[2.5rem] bg-white border border-black/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-6">
                <Fingerprint className="h-6 w-6 text-amber-600" />
                <h4 className="font-bold uppercase tracking-widest text-xs">Biometric Verification</h4>
                <p className="text-sm text-black/40 leading-relaxed font-light">Structural analysis of thread-count and artisanal construction methods.</p>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-[#F5F2F0] space-y-6">
                <History className="h-6 w-6 text-amber-600" />
                <h4 className="font-bold uppercase tracking-widest text-xs">Era Chronology</h4>
                <p className="text-sm text-black/40 leading-relaxed font-light">Documenting the cultural movement behind every silhouette we acquire.</p>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
              <img src="labbg.jpg" className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105" alt="Curator Detail" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent flex flex-col justify-end p-16">
                <span className="text-amber-700 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Laboratory Archives</span>
                <p className="text-2xl italic font-display text-black/80 leading-tight">"Truth is found in the texture, not the tag."</p>
              </div>
            </div>
            {/* Abstract Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-[60px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: THE ERA LOOKBOOK (HORIZONTAL LIGHT) */}
      <section ref={horizontalRef} className="h-[300vh] relative bg-[#F5F2F0]/50">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <motion.div 
            style={{ x: xTranslate }}
            className="flex gap-20 px-[10vw] items-center"
          >
            <div className="flex-shrink-0 w-[40vw] flex flex-col justify-center space-y-8">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.8em]">Temporal Curation</span>
              <h2 className="text-7xl font-bold tracking-tighter text-black">
                The Legacy <br /> 
                <span className="italic font-display text-black/10">Catalog</span>
              </h2>
              <div className="w-20 h-px bg-black/10" />
            </div>

            {ERAS.map((era, i) => (
              <div key={i} className="flex-shrink-0 w-[60vw] md:w-[40vw] h-[65vh] group relative">
                <div className="absolute -top-16 left-0 text-[15rem] font-black text-black/[0.02] pointer-events-none select-none">
                  {era.year}
                </div>
                <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden bg-white shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-black/[0.02]">
                  <img src={era.img} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt={era.title} />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-white via-white/10 to-transparent">
                    <span className="text-amber-700 text-xs font-black uppercase tracking-[0.4em] mb-3">{era.year}</span>
                    <h3 className="text-4xl font-bold mb-4 text-black">{era.title}</h3>
                    <p className="text-black/40 max-w-sm font-light leading-relaxed">{era.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: THE PRIVATE SHOWROOM */}
      <section className="py-60 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-[5rem] overflow-hidden bg-white p-12 md:p-32 shadow-[0_50px_100px_rgba(0,0,0,0.03)] border border-black/[0.02]">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="inline-flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#F5F2F0] flex items-center justify-center">
                  <Lock className="h-8 w-8 text-black" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/30">Private Tier Access</span>
              </div>
              
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none text-black">
                The Private <br />
                <span className="italic font-display text-black/10 text-4xl md:text-7xl">Showroom</span>
              </h2>
              
              <p className="text-xl text-black/40 font-light max-w-md leading-relaxed">
                The most significant acquisitions never reach the public catalog. Membership grants you entrance to the inner vault and bespoke sourcing privileges.
              </p>
              
              <div className="pt-6">
                <MagneticButton>
  <Link href="/visit-us" className="block">
    <button
      type="button"
      className="group relative px-12 py-6 rounded-full bg-black text-white font-bold uppercase tracking-[0.4em] text-[10px] flex items-center gap-4 hover:bg-amber-600 transition-colors"
    >
      Find Us At
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
    </button>
  </Link>
</MagneticButton>

              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 items-start">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="space-y-8"
               >
                  <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border border-black/[0.03]">
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Asset Detail" />
                  </div>
                  <div className="text-center px-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/20">Archival Silhouette #44</span>
                  </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="space-y-8 pt-20"
               >
                  <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border border-black/[0.03]">
                    <img src="verification.jpg" className="w-full h-full object-cover" alt="Asset Detail" />
                  </div>
                  <div className="text-center px-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/20">Verification Ritual #02</span>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE FINAL STATEMENT */}
      <section className="py-60 text-center relative overflow-hidden bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-6 space-y-16 relative z-10"
        >
          <h2 className="text-5xl md:text-8xl font-bold leading-tight tracking-tight italic font-display text-black/70">
            "Preserving the past <br /> to inspire the permanent."
          </h2>
          
          <div className="flex flex-col items-center gap-12">
            <div className="flex gap-8">
               <div className="flex flex-col items-center">
                 <span className="text-2xl font-bold">XV</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Standard</span>
               </div>
               <div className="w-px h-12 bg-black/10" />
               <div className="flex flex-col items-center">
                 <span className="text-2xl font-bold">128</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Artifacts</span>
               </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
                <div className="w-px h-24 bg-gradient-to-b from-amber-600 to-transparent" />
                <span className="text-[10px] font-black uppercase tracking-[1em] text-black/10">The Narrative Ends</span>
            </div>
          </div>
        </motion.div>
        
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-amber-100/30 blur-[150px] -z-0" />
      
      </section>
      
    </div>
  );
};
