
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const Background3D: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-[#fafafa]">
      {/* Dynamic Glow 1 */}
      <motion.div 
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[120px]"
      />
      
      {/* Dynamic Glow 2 */}
      <motion.div 
        style={{
          x: springX,
          y: springY,
          translateX: '20%',
          translateY: '20%',
        }}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-pink-200/20 blur-[100px]"
      />

      {/* Static Accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-orange-100/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
    </div>
  );
};
