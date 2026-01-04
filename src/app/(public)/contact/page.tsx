
"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowUpRight, MessageCircle, Instagram, Mail, Fingerprint, Sparkles, Globe, Compass } from 'lucide-react';
import { MagneticButton } from '@/components/MagneticButton';

const CONCIERGE_CHANNELS = [
  {
    id: "01",
    name: "Liaison via WhatsApp",
    label: "Immediate Acquisition",
    link: "https://wa.me/60149226456",
    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200", // High-end boutique interior
    meta: "Direct line to our senior curators."
  },
  {
    id: "02",
    name: "Visual Narrative / Tiktok",
    label: "Digital Curation",
    link: "https://tiktok.com/@ximyvault",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200", // High-fashion editorial
    meta: "Daily updates from the vault floor."
  },
  {
    id: "03",
    name: "Formal Inquiry / Email",
    label: "Institutional Correspondence",
    link: "mailto:ximyvault@gmail.com",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", // Minimalist architecture
    meta: "Museum lending and press relations."
  }
];

const ContactPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const heroOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.1], [1, 1.1]);

  return (
    <div
  ref={containerRef}
  className="relative bg-[#F9F8F6] text-[#1A1A1A] overflow-hidden -mt-24"
>

      {/* TACTILE OVERLAY (Subtle Silk Texture) */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

      {/* SECTION 1: EDITORIAL HERO */}
      <section className="relative h-[calc(100vh-6rem)] pt-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover brightness-[0.9] grayscale-[0.1]"
            alt="Atelier Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F8F6]/20 via-transparent to-[#F9F8F6]" />
        </motion.div>

        <div className="relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[1.5em] text-black/40">The Concierge Suite</span>
            <div className="w-px h-16 bg-black/20" />
          </motion.div>
          
          <h1 className="text-[12vw] font-bold tracking-tighter leading-none text-black drop-shadow-2xl">
            LIAISON
          </h1>

          <div className="max-w-xl mx-auto">
            <p className="text-xl md:text-2xl text-black/60 font-light italic font-display leading-relaxed">
              Bridging the gap between history and the modern collector through personalized archival access.
            </p>
          </div>
        </div>

        {/* Floating Text Artifact */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between px-10 pointer-events-none opacity-5 select-none">
          <span className="text-[20vw] font-black uppercase tracking-tighter transform -rotate-90 origin-center">VAULT</span>
          <span className="text-[20vw] font-black uppercase tracking-tighter transform rotate-90 origin-center">ARCHIVE</span>
        </div>
      </section>

      {/* SECTION 2: CINEMATIC CHANNELS (EDITORIAL GRID) */}
      <section className="relative z-20 py-80 max-w-[1400px] mx-auto px-6">
        <div className="space-y-[60vh]">
          {CONCIERGE_CHANNELS.map((channel, i) => (
            <EditorialSection key={channel.id} channel={channel} index={i} />
          ))}
        </div>
      </section>

      {/* SECTION 3: THE PRIVATE CORRESPONDENCE (LUXURY STATIONERY) */}
      <section className="py-80 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto relative group"
        >
          <div className="absolute -inset-20 bg-amber-50/30 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative bg-white rounded-[4rem] p-12 md:p-32 shadow-[0_80px_150px_rgba(0,0,0,0.03)] border border-black/[0.01] overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="h-20 w-20 text-[#A68966]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-14">
                <div className="inline-flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#F9F8F6] flex items-center justify-center border border-black/[0.03]">
                    <Fingerprint className="h-8 w-8 text-black/80" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.8em] text-black/30">Tier II Protocol</span>
                </div>
                
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-black">
                  Bespoke <br />
                  <span className="italic font-display text-black/10">Ritual</span>
                </h2>
                
                <p className="text-2xl text-black/40 font-light italic font-display leading-relaxed">
                  For the pursuit of singular artifacts not listed in our public archives, our concierge service is available for private commissions.
                </p>
              </div>

              <div className="space-y-10">
                <div className="p-12 rounded-[2rem] bg-[#1A1A1A] text-white space-y-8 shadow-3xl">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                    <span>Sourcing Invitation</span>
                    <span>No. XV-001</span>
                  </div>
                  <p className="text-xl font-light text-white/80">Activate our global network of curators to locate your specific archival silhouette.</p>
                  <MagneticButton>
                    <button className="w-full   py-4 px-5 rounded-full bg-[#A68966] text-white font-bold uppercase tracking-[0.4em] text-[8px] flex items-center justify-center gap-6 transition-transform hover:scale-105 active:scale-95 shadow-lg">
                      Enter The Chamber <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: GLOBAL DIRECTORY (REFINED MINIMALISM) */}
      <section className="py-60 border-t border-black/5 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16">
            <div className="space-y-8">
              <span className="text-[10px] font-black uppercase tracking-[1em] text-[#A68966]">The Directory</span>
              <h3 className="text-5xl md:text-8xl font-bold tracking-tighter text-black">
                Follow The <br />
                <span className="italic font-display text-black/10">Movement.</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-x-20 gap-y-10">
              {[
                { name: "Instagram", link: "https://instagram.com/ximyvault", icon: <Instagram /> },
                { name: "Facebook", link: "https://facebook.com/ximyvault", icon: <Globe /> },
                { name: "TikTok", link: "https://tiktok.com/@ximysthrifted13", icon: <Compass /> },
                { name: "The Archive", link: "#", icon: <Sparkles /> }
              ].map((item) => (
                <a key={item.name} href={item.link} className="flex flex-col gap-4 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-black/30 group-hover:text-black transition-colors">{item.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-black group-hover:text-[#A68966] transition-colors">{item.name}</span>
                  </div>
                  <div className="h-px w-full bg-black/5 group-hover:bg-black transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL STATEMENT */}
      <section className="py-80 text-center relative overflow-hidden bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 space-y-20 relative z-10"
        >
          <h4 className="
  text-5xl md:text-[5rem]
  font-bold italic font-display
  leading-[0.95]
  tracking-tighter
  pb-[0.2em]
  text-transparent bg-clip-text
  bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-400
">
   "Your pursuit is our legacy."
</h4>


          
          <div className="flex flex-col items-center gap-20">
            <div className="flex flex-col items-center gap-8">
                <div className="w-px h-32 bg-gradient-to-b from-black/20 to-transparent" />
                <div className="text-[10px] font-black uppercase tracking-[1.5em] text-black/5">Establishing Connection</div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactPage;

const EditorialSection: React.FC<{ channel: any, index: number }> = ({ channel, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div 
      ref={ref}
      className={`flex flex-col lg:flex-row gap-24 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* IMAGE FRAME WITH CURTAIN REVEAL */}
      <div className="w-full lg:w-[55%] relative group">
        <motion.div 
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[16/11] rounded-[0.5rem] overflow-hidden shadow-2xl"
        >
          <img 
            src={channel.img} 
            className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" 
            alt={channel.name} 
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
        </motion.div>
        
        {/* Floating Meta Tag */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className={`absolute -bottom-8 ${index % 2 !== 0 ? '-left-8' : '-right-8'} p-8 bg-white border border-black/[0.03] shadow-3xl rounded-[2rem] hidden md:block z-30`}
        >
          <div className="flex items-center gap-4">
             <div className="w-8 h-px bg-[#A68966]" />
             <span className="text-[9px] font-black uppercase tracking-widest text-[#A68966]">{channel.id} / CHANNEL REF</span>
          </div>
        </motion.div>
      </div>

      {/* CONTENT COLUMN */}
      <div className="w-full lg:w-[45%] space-y-12">
        <div className="space-y-6">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={isInView ? { opacity: 1, x: 0 } : {}}
             className="flex items-center gap-4 text-[#A68966]"
          >
            <div className="w-12 h-px bg-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">{channel.label}</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-black">
            {channel.name.split(' / ')[0]} <br />
            <span className="italic font-display text-black/10">{channel.name.split(' / ')[1]}</span>
          </h2>
        </div>

        <div className="space-y-10">
          <p className="text-2xl text-black/40 font-light font-display italic leading-relaxed">
            "{channel.meta}"
          </p>
          
          <div className="pt-6">
            <MagneticButton>
              <a 
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex flex-col gap-3"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20">Establish Liaison Point</span>
                <div className="px-14 py-7 rounded-full bg-black text-white font-bold uppercase tracking-[0.4em] text-[10px] flex items-center gap-6 shadow-2xl transition-all hover:bg-[#A68966] hover:scale-105">
                  Establish Connection <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};
