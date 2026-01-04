
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, .group'));
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-purple-600/30 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
        }}
        transition={{ scale: { duration: 0.3 } }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-purple-600 rounded-full z-[9999] pointer-events-none hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: 13,
          translateY: 13,
        }}
      />
    </>
  );
};
