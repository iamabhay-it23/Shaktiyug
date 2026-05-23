import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LotusSparkle {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: string;
  size: number;
}

const LOTUS_COLORS = [
  '#d6af37', // Shakti Gold
  '#ff2d55', // Lotus Pink
  '#e0115f', // Deep Ruby
  '#ffffff', // Pearl White
  '#fca5a5'  // Soft Rose
];

export default function GlobalLotusClicks() {
  const [clickSparkles, setClickSparkles] = useState<LotusSparkle[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore click inside elements that have specific exceptions if any,
      // but otherwise render a lotus exactly where the user clicked!
      const target = e.target as HTMLElement;
      
      // Let's get the absolute cursor coordinate relative to viewport
      const x = e.clientX;
      const y = e.clientY;
      const id = Date.now() + Math.random();
      const angle = (Math.random() - 0.5) * 40; // Random tilt
      const color = LOTUS_COLORS[Math.floor(Math.random() * LOTUS_COLORS.length)];
      const size = Math.random() * 8 + 14; // Tiny lotus (14px - 22px)

      const newSparkle: LotusSparkle = {
        id,
        x,
        y,
        angle,
        color,
        size
      };

      setClickSparkles((prev) => {
        // Limit maximum simultaneous sparkles on screen to maintain top performance
        const active = [...prev, newSparkle];
        if (active.length > 12) {
          return active.slice(active.length - 12);
        }
        return active;
      });

      // Erase sparkle after animation completes (800ms)
      setTimeout(() => {
        setClickSparkles((prev) => prev.filter((item) => item.id !== id));
      }, 850);
    };

    window.addEventListener('click', handleGlobalClick, { passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {clickSparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 0, 
              scale: 0.1, 
              x: sparkle.x, 
              y: sparkle.y, 
              rotate: sparkle.angle,
              translateY: "-50%",
              translateX: "-50%"
            }}
            animate={{ 
              opacity: [0, 0.95, 0.95, 0], 
              scale: [0.2, 1.15, 1.0, 0.7], 
              y: sparkle.y - 30, // Rise up 30px
              rotate: sparkle.angle + (Math.random() > 0.5 ? 12 : -12)
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.4,
              y: sparkle.y - 45
            }}
            transition={{ 
              duration: 0.8,
              ease: [0.175, 0.885, 0.32, 1.2] // Beautiful bouncy spring-like ease
            }}
            className="absolute"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              color: sparkle.color,
            }}
          >
            {/* Elegant Vector Lotus silhouette */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full drop-shadow-[0_0_6px_var(--lotus-shadow)]"
              style={{
                // Custom CSS variable mapping to make drop-shadow match the color precisely
                filter: `drop-shadow(0 0 4px ${sparkle.color})`,
              } as React.CSSProperties}
            >
              {/* Central vertical petal */}
              <path d="M12,22 C9.5,18 8,16 8,13.5 C8,11 9.5,10.5 12,6 C14.5,10.5 16,11 16,13.5 C16,16 14.5,18 12,22 Z" />
              {/* Left wing petal */}
              <path d="M12,22 C8,20.5 6,18 6,15.5 C6,13 8.5,12.5 9.5,10 C9.5,14 10.7,16 12,22 Z" opacity="0.85" />
              {/* Right wing petal */}
              <path d="M12,22 C16,20.5 18,18 18,15.5 C18,13 15.5,12.5 14.5,10 C14.5,14 13.3,16 12,22 Z" opacity="0.85" />
              {/* Outer-left petal */}
              <path d="M12,22 C5.5,22 4,19.5 4,17 C4,14.5 7,14 8,12.5 C7.5,16.5 10,19.5 12,22 Z" opacity="0.65" />
              {/* Outer-right petal */}
              <path d="M12,22 C18.5,22 20,19.5 20,17 C20,14.5 17,14 16,12.5 C16.5,16.5 14,19.5 12,22 Z" opacity="0.65" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
