
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ItemWithDetails } from '../lib/types';
import { Heart } from 'lucide-react';

interface PremiumCardProps {
  item: ItemWithDetails;
  index: number;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const primaryImage = item.images.find(img => img.is_primary) || item.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ perspective: "1000px" }}
      className="relative group"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-black/5 transition-all duration-300 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]"
      >
        <div 
          style={{ transform: "translateZ(50px)" }}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <img 
            src={primaryImage.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute top-6 left-6 z-10">
            <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-black border border-white">
              Rare Find
            </div>
          </div>

          <div className="absolute top-6 right-6 z-10">
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black/40 hover:text-red-500 transition-colors shadow-sm">
              <Heart className="h-5 w-5 fill-current" />
            </button>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div 
          style={{ transform: "translateZ(40px)" }}
          className="p-8"
        >
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-xl font-bold leading-tight group-hover:text-purple-600 transition-colors">
              {item.title}
            </h3>
            <span className="text-2xl font-display italic font-bold text-black/90 whitespace-nowrap">
              RM{item.price}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-black/30">Available in Vault</span>
          </div>
        </div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
};
