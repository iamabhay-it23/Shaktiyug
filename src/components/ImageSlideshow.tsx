import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SHAKTI_IMAGES = [
  'https://i.pinimg.com/736x/83/b7/8e/83b78eb323d12c8728587229bdd3cecd.jpg',
  'https://i.pinimg.com/736x/2f/3b/a9/2f3ba94ca95d7675fca4dc75213ecaf8.jpg',
  'https://i.pinimg.com/736x/77/2e/97/772e978ca2dc66a15386828e245f4cba.jpg',
  'https://i.pinimg.com/736x/81/1f/4f/811f4f7dd99f8f6da90a2cd45c044ba4.jpg',
  'https://i.pinimg.com/736x/91/4e/5c/914e5ce81a91641e98b32a9fedc10b61.jpg',
  'https://i.pinimg.com/736x/0e/cb/8f/0ecb8f55928b79272ec4f96809c594d0.jpg',
  'https://i.pinimg.com/736x/a0/48/74/a0487433b4ebdf1cce006bbae18dfd76.jpg',
  'https://i.pinimg.com/736x/5f/da/94/5fda94b82b9329f84d918f07cb9fa2b8.jpg',
  'https://i.pinimg.com/736x/ae/90/f5/ae90f5ed75ec750890911876faf7bfdb.jpg',
];

export default function ImageSlideshow({ className = "" }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHAKTI_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % SHAKTI_IMAGES.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + SHAKTI_IMAGES.length) % SHAKTI_IMAGES.length);

  return (
    <div className={`relative group overflow-hidden rounded-sm border border-white/5 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={SHAKTI_IMAGES[currentIndex]}
            alt={`Shaktiyug Moment ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-shakti-black via-transparent to-transparent opacity-60" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        <button 
          onClick={prev}
          className="p-3 bg-shakti-black/50 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-lotus-pink hover:border-lotus-pink transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={next}
          className="p-3 bg-shakti-black/50 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-lotus-pink hover:border-lotus-pink transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SHAKTI_IMAGES.map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-500 rounded-full ${
              i === currentIndex ? 'w-8 bg-lotus-pink shadow-[0_0_10px_rgba(255,45,85,0.5)]' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Overlay Text */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-2 px-3 py-1 bg-shakti-black/40 backdrop-blur-md border border-lotus-pink/30 rounded-full">
          <div className="w-1.5 h-1.5 bg-lotus-pink animate-pulse rounded-full" />
          <span className="text-[8px] uppercase tracking-[0.3em] font-black text-white">Live Ramp Feed</span>
        </div>
      </div>
    </div>
  );
}
