'use client'

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { MagneticButton } from '@/components/MagneticButton';
import Link from "next/link";

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Scroll transforms
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.2]);
  const yPos = useTransform(scrollY, [0, 800], [0, 300]);

  // Cursor-based parallax transforms
  const rotateX = useTransform(springY, [-500, 500], [5, -5]);
  const rotateY = useTransform(springX, [-500, 500], [-5, 5]);
  const moveX = useTransform(springX, [-500, 500], [-20, 20]);
  const moveY = useTransform(springY, [-500, 500], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[110vh] -mt-[100px] flex flex-col items-center justify-center overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      {/* Background Image Layer */}
      <motion.div 
        style={{ 
          opacity, 
          scale,
          y: yPos,
          rotateX,
          rotateY,
        }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute top-[-20vh] left-[-15vw] w-[130vw] h-[140vh] bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
          alt="High-end Vintage Fashion"
          className="w-full h-full object-cover scale-110 brightness-75 grayscale-[0.2]"
        />
        {/* Decorative Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fafafa] z-20" />
      </motion.div>

      {/* Floating Content Layer */}
      <motion.div 
        style={{ 
          opacity,
          x: moveX,
          y: moveY,
        }}
        className="relative z-30 flex flex-col items-center text-center px-6"
      >
{/* NEW ENHANCED DYNAMIC BADGE */}
<motion.div 
  initial={{ opacity: 0, scale: 0.85 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
  className="
    relative 
    mt-16 md:mt-0          /* ⬅ pushes DOWN on mobile only */
    mb-8 md:mb-14 
    group cursor-pointer
  "
>
  {/* Pulsing Aura */}
  <div
    className="
      absolute 
      -inset-5 md:-inset-8
      bg-gradient-to-r from-purple-500/10 via-pink-500/20 to-orange-500/10
      blur-[28px] md:blur-[40px]
      rounded-full
      animate-pulse
      group-hover:bg-purple-500/30
      transition-all duration-700
    "
  />

  <div
    className="
      relative flex items-center
      gap-3 md:gap-5
      px-4 py-2.5 md:px-8 md:py-4
      rounded-full                 /* 🍎 Apple-style smooth pill */
      border border-white/20
      bg-black/20 backdrop-blur-3xl
      overflow-hidden
      shadow-2xl
    "
  >
    {/* 3D Rotating Ring Icon */}
    <div className="relative w-9 h-9 md:w-12 md:h-12 flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-dashed border-white/30 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-1 border border-white/10 rounded-full"
      />
      <img
  src="/star.PNG"
  alt="Star"
  className="h-4 w-4 md:h-5 md:w-5 relative z-10 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]"
/>

    </div>

    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2 mb-0.5">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
        />
        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.45em] md:tracking-[0.6em] text-white/50">
          Verified Archival
        </span>
      </div>

      <span className="text-xs md:text-base font-bold uppercase tracking-[0.18em] md:tracking-[0.25em] text-white">
        The Archival Standard
      </span>
    </div>

    {/* Scanning Laser Line Effect */}
    <motion.div 
      animate={{ x: ['-100%', '300%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="
        absolute inset-0 w-1/3 h-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        skew-x-[35deg]
        pointer-events-none
      "
    />
  </div>
</motion.div>


        <div className="relative mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-8xl md:text-[7rem] font-bold tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            XIMY{" "}
            <span
  className="
    relative inline-block
    font-[var(--font-allura)]
    font-normal                /* ✅ IMPORTANT */
    tracking-wide
    text-transparent
    bg-gradient-to-r from-white via-white to-white/50
    bg-clip-text
  "
>
  VAULT
  <motion.div 
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 1.5, delay: 0.8 }}
    className="absolute -bottom-4 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent origin-left rounded-full shadow-lg shadow-purple-500/50"
  />
</span>


          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-14 max-w-2xl text-base md:text-lg text-white/80 font-light tracking-wide leading-relaxed drop-shadow-lg"
        >
          A sanctuary for the world's most coveted vintage artifacts. 
          Rare silhouettes, timeless craftsmanship, curated for the modern connoisseur.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          <MagneticButton>
  <Link href="/collection" className="block">
    <button
      type="button"
      className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
    >
      <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
        Enter The Collection
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
      </span>

      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </button>
  </Link>
</MagneticButton>
          
          <MagneticButton>
  <a
    href="https://wa.link/a54ut7"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <button
      type="button"
      className="
        group relative
        flex items-center justify-center gap-3
        px-10 py-4
        rounded-full
        border border-white/30
        bg-white/10
        backdrop-blur-xl
        text-white
        font-semibold
        uppercase tracking-widest text-xs
        transition-all duration-300
        hover:bg-white/20
        hover:border-white/50
        hover:scale-[1.03]
        active:scale-[0.97]
      "
    >
      <span>Chat With Us</span>

      {/* soft ring pulse */}
      <span className="absolute -inset-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  </a>
</MagneticButton>


        </motion.div>
      </motion.div>

     {/* Floating 3D-like Artifacts */}
<motion.div 
  style={{ 
    y: useTransform(scrollY, [0, 1000], [0, -200]), 
    x: moveX, 
    rotate: 15 
  }}
  className="absolute top-1/4 -right-20 w-80 h-[500px] rounded-[3rem] overflow-hidden hidden lg:block border border-white/20 shadow-2xl shadow-black/40 rotate-12"
>
  <img 
    src="/girl.jpg"
    className="w-full h-full object-cover"
    alt="Girl"
  />
</motion.div>

<motion.div 
  style={{ 
    y: useTransform(scrollY, [0, 1000], [0, -400]), 
    x: moveX, 
    rotate: -10 
  }}
  className="absolute bottom-1/4 -left-20 w-72 h-[450px] rounded-[3rem] overflow-hidden hidden lg:block border border-white/20 shadow-2xl shadow-black/40 -rotate-12"
>
  <img 
    src="/sweater.PNG"
    className="w-full h-full object-cover brightness-90"
    alt="Sweater"
  />
</motion.div>


      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4"
      >
        <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Scroll to Explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
};
