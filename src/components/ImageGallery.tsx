import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { Filter, ChevronDown, SortAsc, SortDesc } from 'lucide-react';

const CATEGORIES = ['All', 'Ramp Walk', 'Editorial', 'Print Media'] as const;
type Category = typeof CATEGORIES[number];

const SHAKTI_IMAGES = [
  { url: 'https://i.pinimg.com/736x/83/b7/8e/83b78eb323d12c8728587229bdd3cecd.jpg', category: 'Ramp Walk', date: '2026-05-01' },
  { url: 'https://i.pinimg.com/736x/2f/3b/a9/2f3ba94ca95d7675fca4dc75213ecaf8.jpg', category: 'Editorial', date: '2026-04-15' },
  { url: 'https://i.pinimg.com/736x/77/2e/97/772e978ca2dc66a15386828e245f4cba.jpg', category: 'Print Media', date: '2026-05-10' },
  { url: 'https://i.pinimg.com/736x/81/1f/4f/811f4f7dd99f8f6da90a2cd45c044ba4.jpg', category: 'Ramp Walk', date: '2026-03-20' },
  { url: 'https://i.pinimg.com/736x/91/4e/5c/914e5ce81a91641e98b32a9fedc10b61.jpg', category: 'Editorial', date: '2026-05-12' },
  { url: 'https://i.pinimg.com/736x/0e/cb/8f/0ecb8f55928b79272ec4f96809c594d0.jpg', category: 'Print Media', date: '2026-01-05' },
  { url: 'https://i.pinimg.com/736x/a0/48/74/a0487433b4ebdf1cce006bbae18dfd76.jpg', category: 'Ramp Walk', date: '2026-02-14' },
  { url: 'https://i.pinimg.com/736x/5f/da/94/5fda94b82b9329f84d918f07cb9fa2b8.jpg', category: 'Editorial', date: '2026-05-05' },
];

export default function ImageGallery({ title = "Visual Archive" }: { title?: string }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredImages = useMemo(() => {
    let result = activeCategory === 'All' 
      ? [...SHAKTI_IMAGES] 
      : SHAKTI_IMAGES.filter(img => img.category === activeCategory);
    
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-4">
          <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-black whitespace-nowrap">{title}</h4>
          <div className="h-[1px] bg-white/5 flex-1 md:w-32" />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-shakti-gold" />
            <div className="flex gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[9px] uppercase tracking-[0.2em] font-bold transition-all ${
                    activeCategory === cat 
                      ? 'text-shakti-gold underline underline-offset-8 decoration-2' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-all"
            >
              {sortBy === 'newest' ? <SortDesc className="w-3 h-3 text-shakti-gold" /> : <SortAsc className="w-3 h-3 text-shakti-gold" />}
              {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>
      </div>
      
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img, i) => (
            <motion.div
              layout
              key={img.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              transition={{ 
                duration: 0.5,
                delay: i * 0.05,
                layout: { type: "spring", stiffness: 200, damping: 25 }
              }}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-white/5 bg-shakti-black shadow-2xl luxury-card"
            >
              <img 
                src={img.url} 
                alt={`Shaktiyug Gallery ${i}`} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-shakti-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-[8px] uppercase tracking-[0.3em] text-shakti-gold font-black mb-1">{img.category}</span>
                <span className="text-[10px] text-white/40 font-serif italic">{new Date(img.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

