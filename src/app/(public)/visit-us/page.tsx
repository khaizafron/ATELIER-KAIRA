"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar, Globe, Sparkles, ArrowRight, ChevronRight, Fingerprint, Compass } from 'lucide-react';
import { MagneticButton } from '@/components/MagneticButton';
import Link from "next/link"

const SITE_EXHIBITIONS = [
  {
    id: "SITE // 01",
    name: "The J @ Seri Alam",
    subtext: "ARCHIVAL HUB / JOHOR",
    address: "The J @ Seri Alam, Johor Bahru",
    area: "Seri Alam, Pasir Gudang, Johor",
    schedule: "Thu & Sun / 7:00 pm - 12:00 am",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.4581766370734!2d103.86773147066637!3d1.4961178577762115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da6b58b4b372ad%3A0x2ce128d63eb5a17f!2sThe%20J%20%40%20Seri%20Alam!5e0!3m2!1sen!2smy!4v1765758087645!5m2!1sen!2smy",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
    description: "Our primary outpost for tactical vintage acquisition. A high-energy evening market setting where the vault opens its most sought-after silhouettes."
  }
];

const VisitUsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);

  return (
    <div
  ref={containerRef}
  className="relative bg-[#FAF9F6] text-[#1A1A1A] overflow-hidden selection:bg-[#A68966] selection:text-white -mt-24"
>

      {/* TACTILE OVERLAY (Film Grain) */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.06] mix-blend-multiply" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

      {/* LUXURY MESH GRADIENT */}
      <div className="fixed inset-0 -z-10 bg-[#F5F2F0]">
        <motion.div 
          style={{ y: bgY }}
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-40 blur-[120px] bg-gradient-to-br from-[#EADFD3] via-[#FDFCFB] to-[#D9C5B2]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(250,249,246,0.8)_100%)]" />
      </div>

      {/* HERO: THE ARCHIVE OUTPOST */}
      <section className="relative h-[110vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
           <span className="absolute top-[20%] left-[-10%] text-[30vw] font-black uppercase tracking-tighter text-black/5 rotate-[-10deg]">OUTPOST</span>
           <span className="absolute bottom-[20%] right-[-10%] text-[30vw] font-black uppercase tracking-tighter text-black/5 rotate-[5deg]">JOHOR</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 space-y-16"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-px h-24 bg-gradient-to-b from-transparent via-[#A68966] to-transparent" 
            />
            <span className="text-[11px] font-black uppercase tracking-[1.5em] text-[#A68966]">Physical Location Protocol</span>
          </div>

          <h1 className="text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-[0.85] text-black">
            VISIT <br />
            <span className="italic font-display text-black/5">The Exhibition</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-black/40 font-light italic font-display leading-relaxed">
            Where digital provenance meets tactile reality. Our sites are selected for their cultural resonance and archival energy.
          </p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 flex flex-col items-center gap-4 text-black/10"
        >
          <span className="text-[9px] font-black uppercase tracking-widest">Descend To Sites</span>
          <Compass className="h-6 w-6 stroke-[1px]" />
        </motion.div>
      </section>

      {/* SITE EXHIBITIONS: EDITORIAL CARDS */}
      <section className="relative z-20 py-40 max-w-[1600px] mx-auto px-6 space-y-[40vh]">
        {SITE_EXHIBITIONS.map((site, i) => (
          <SiteIntelCard key={site.id} site={site} index={i} />
        ))}
      </section>

      {/* PROTOCOL GRID: WHAT TO EXPECT */}
      <section className="py-80 bg-white/30 backdrop-blur-xl border-y border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-40">
            <div className="space-y-10">
              <span className="text-[11px] font-black uppercase tracking-[1em] text-[#A68966]">On-Site Protocol</span>
              <h2 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none text-black">
                Tactile <br />
                <span className="italic font-display text-black/10">Verification.</span>
              </h2>
            </div>
            <p className="max-w-md text-xl text-black/40 font-light italic font-display leading-relaxed">
              Every site visit is an opportunity to verify the silhouette, the grain, and the historical gravity of our pieces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Fingerprint />, title: "Archive Intel", desc: "Access the full provenance history of pieces not yet listed on our digital platform." },
              { icon: <Globe />, title: "Curated Flow", desc: "Experience a rotating physical selection tailored specifically to the site's energy." },
              { icon: <Sparkles />, title: "Vault Access", desc: "Exclusive priority for on-site visitors to reserve artifacts from the upcoming drops." },
              { icon: <Clock />, title: "Liaison Hours", desc: "Late-night access designed for the modern collector's nocturnal lifestyle." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="group p-12 rounded-[3rem] bg-white border border-black/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.05)]"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] flex items-center justify-center text-[#A68966] mb-10 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold tracking-tight mb-4 uppercase">{item.title}</h4>
                <p className="text-sm text-black/40 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ARCHIVE */}
      <section className="py-80 text-center relative">
        <div className="max-w-4xl mx-auto px-6 space-y-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-5xl md:text-[8rem] font-bold tracking-tighter leading-[0.85] italic font-display text-black/80">
              "Provenance <br /> in Person."
            </h2>
            <p className="text-2xl text-black/30 font-light max-w-lg mx-auto italic font-display">
              Can't make it to our physical outposts? The digital archive remains open for global acquisition.
            </p>
          </motion.div>
          
          <div className="flex flex-col items-center gap-16 pt-10">
            <MagneticButton>
  <Link href="/collection">
    <button
      type="button"
      className="px-16 py-8 rounded-full bg-[#1A1A1A] text-white font-bold uppercase tracking-[0.5em] text-[10px] shadow-3xl hover:bg-[#A68966] transition-all flex items-center gap-6 group"
    >
      Enter Digital Collection
      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
    </button>
  </Link>
</MagneticButton>
            <div className="flex flex-col items-center gap-8">
                <div className="w-px h-32 bg-gradient-to-b from-black/10 to-transparent" />
                <div className="text-[10px] font-black uppercase tracking-[1.5em] text-black/10 italic">XV Outpost Protocol</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SiteIntelCard: React.FC<{ site: any, index: number }> = ({ site, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <div 
      ref={cardRef}
      className={`relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center ${index % 2 !== 0 ? 'lg:direction-rtl' : ''}`}
    >
      {/* BACKGROUND DECORATIVE NUMBER */}
      <div className={`absolute -top-20 ${index % 2 === 0 ? 'left-0' : 'right-0'} text-[20vw] font-black text-black/[0.02] pointer-events-none select-none italic font-display leading-none`}>
        {site.id.split(' // ')[1]}
      </div>

      {/* IMAGE / MAP CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={`lg:col-span-7 relative group rounded-[4rem] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.1)] aspect-square md:aspect-[16/11] ${index % 2 !== 0 ? 'lg:order-last' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <img 
                src={site.img} 
                className="w-full h-full object-cover grayscale-[0.3] brightness-[0.8] transition-transform duration-[6s] group-hover:scale-110" 
                alt={site.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-16">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Hover to expand site intel</span>
                    <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter italic font-display">{site.subtext}</h3>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 z-20"
            >
              <iframe
                src={site.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full grayscale-[1] brightness-[0.9] invert-[0.05]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CONTENT COLUMN */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="lg:col-span-5 space-y-12"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-[#A68966]">
            <div className="w-12 h-px bg-current" />
            <span className="text-[11px] font-black uppercase tracking-[0.8em]">{site.id}</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none text-black">
            {site.name.split(' @ ')[0]} <br />
            <span className="italic font-display text-black/10 text-4xl md:text-6xl">@{site.name.split(' @ ')[1]}</span>
          </h2>
        </div>

        <div className="space-y-10">
          <p className="text-xl text-black/40 font-light font-display italic leading-relaxed">
            "{site.description}"
          </p>
          
          <div className="space-y-6 pt-10 border-t border-black/[0.03]">
             <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#A68966]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                   <p className="text-lg font-bold tracking-tight">{site.address}</p>
                   <p className="text-[11px] font-black uppercase tracking-widest text-black/30">{site.area}</p>
                </div>
             </div>
             <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#A68966]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                   <p className="text-lg font-display italic text-black/60">{site.schedule}</p>
                   <p className="text-[11px] font-black uppercase tracking-widest text-black/30">Active Protocol</p>
                </div>
             </div>
          </div>

          <div className="pt-8">
            <MagneticButton>
              <a 
                href="https://maps.app.goo.gl/Fo9GMMDEQ7H4wNeX7"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-8 py-7 px-14 rounded-full bg-black text-white font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-[#A68966] transition-all active:scale-95"
              >
                Request Navigation <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </a>
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VisitUsPage;
