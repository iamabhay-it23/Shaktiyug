import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Camera, Scissors, Flower2, Lightbulb, Sparkles, Wind, Zap } from 'lucide-react';
import ShaktiyugLogo from './ShaktiyugLogo';

const QUOTE = "STEP INTO THE SHAKTIYUG, WHERE BEAUTY MEETS THE BEAT OF THE RAMP, AND EVERY WALK IS A STORY OF STRENGTH";

const GEAR_ICONS = [
  { icon: Camera, top: '15%', left: '10%', delay: 0 },
  { icon: Scissors, top: '25%', left: '85%', delay: 0.5 },
  { icon: Flower2, top: '65%', left: '15%', delay: 1 },
  { icon: Lightbulb, top: '75%', left: '80%', delay: 1.5 },
  { icon: Sparkles, top: '45%', left: '50%', delay: 2 },
  { icon: Wind, top: '10%', left: '40%', delay: 0.8 },
  { icon: Zap, top: '80%', left: '30%', delay: 1.2 },
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);
  const [startQuote, setStartQuote] = useState(false);
  const [shutterOpen, setShutterOpen] = useState(false);

  useEffect(() => {
    // Stage 0: Lotus entry
    const t0 = setTimeout(() => {
      setShutterOpen(true);
    }, 500);

    // Stage 1: Wait for lotus bloom, then show quote
    const t1 = setTimeout(() => {
      setStartQuote(true);
    }, 3500);

    // Stage 2: 10s total duration
    const t2 = setTimeout(() => {
      setShow(false);
    }, 10000);

    // Exit
    const t3 = setTimeout(() => {
      onComplete();
    }, 11500);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const words = QUOTE.split(' ');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(30px) brightness(200%)' }}
          transition={{ duration: 2, ease: "circIn" }}
          className="fixed inset-0 z-[100] bg-shakti-black flex flex-col items-center justify-center p-8 overflow-hidden"
        >
          {/* Lotus Cinematic Entry - Now with Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={shutterOpen ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="mb-12 relative"
          >
            <ShaktiyugLogo className="scale-[2.5]" />
            <motion.div
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-shakti-gold/10 blur-[60px] rounded-full -z-10"
            />
          </motion.div>
          {/* Production Gear Floating - Smooth motion, no blinking */}
          {GEAR_ICONS.map((Gear, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5, y: 50, rotate: idx * 45 }}
              animate={shutterOpen ? { 
                opacity: 0.15, 
                scale: 1, 
                y: 0,
                rotate: [idx * 45, idx * 45 + 360],
                x: [0, 30, -30, 0]
              } : {}}
              transition={{ 
                opacity: { duration: 3, delay: Gear.delay },
                scale: { duration: 3, delay: Gear.delay },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                x: { duration: 25, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ position: 'absolute', top: Gear.top, left: Gear.left }}
              className="text-shakti-gold pointer-events-none"
            >
              <Gear.icon size={160} strokeWidth={0.2} />
            </motion.div>
          ))}

          {/* Shutter Blade Visuals - Now Goldish */}
          <motion.div
            initial={{ y: 0 }}
            animate={shutterOpen ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-black z-50 border-b border-shakti-gold/30"
          />
          <motion.div
            initial={{ y: 0 }}
            animate={shutterOpen ? { y: '100%' } : { y: 0 }}
            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-black z-50 border-t border-shakti-gold/30"
          />
          
          <div className="relative max-w-5xl text-center z-10 px-4">
            <motion.div 
              className="flex flex-wrap justify-center gap-x-4 gap-y-3"
              animate={startQuote ? { rotateX: [20, 0], scale: [1.1, 1] } : {}}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, rotateY: 90, filter: 'blur(20px)' }}
                  animate={startQuote ? { opacity: 1, y: 0, rotateY: 0, filter: 'blur(0px)' } : {}}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="font-serif text-3xl md:text-5xl lg:text-7xl italic tracking-tighter text-white drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            
            {/* Lotus Spotlight - Enhanced */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={startQuote ? { opacity: 0.3, scale: [0, 2.5, 2.2] } : {}}
              transition={{ delay: 0.5, duration: 6, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-[200px] bg-shakti-gold w-[400px] h-[400px] rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={shutterOpen ? { opacity: [0, 0.1, 0] } : {}}
            transition={{ duration: 0.1, repeat: 3, repeatDelay: 0.2 }}
            className="absolute inset-0 bg-white pointer-events-none z-[100]"
          />
          
          {/* Bloom transition at end */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={!show ? { opacity: 1 } : {}}
            className="absolute inset-0 bg-shakti-black transition-opacity duration-1000 z-[60]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
