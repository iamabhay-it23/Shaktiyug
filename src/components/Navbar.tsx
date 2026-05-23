import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Shirt, MessageSquare, User, Tv, Shield, Menu, X } from 'lucide-react';
import ShaktiyugLogo from './ShaktiyugLogo';

const NAV_ITEMS = [
  { name: 'Casting', icon: Shirt, id: 'casting' },
  { name: 'Fashion Hub', icon: Scissors, id: 'dashboard' },
  { name: 'Backstage', icon: MessageSquare, id: 'screening' },
  { name: 'Live', icon: Tv, id: 'live' },
  { name: 'Backstage Control', icon: Shield, id: 'admin' },
  { name: 'Profile', icon: User, id: 'profile' },
];

export default function Navbar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: string) => {
    setActive(id);
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between bg-gradient-to-b from-shakti-black via-shakti-black/90 to-transparent backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-2">
          <ShaktiyugLogo />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center group transition-all duration-550 ${
                active === item.id ? 'text-shakti-gold' : 'text-white/40 hover:text-white'
              }`}
            >
              <item.icon className={`w-4 h-4 transition-transform duration-500 ${active === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black font-sans relative mt-1">
                {item.name}
                {active === item.id && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-shakti-gold to-transparent"
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Vogue In CTA & Mobile Toggle wrapper */}
        <div className="flex items-center gap-4">
          <button className="fashion-button px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-bold hidden sm:inline-block">
            <span>Vogue In</span>
          </button>

          {/* Hamburger switch for custom side panel on Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-white/5 bg-white/[0.02] hover:bg-white/5 text-white md:hidden rounded-sm cursor-pointer transition-colors"
            title="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-5 h-5 text-shakti-gold" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#090308]/98 backdrop-blur-3xl flex flex-col pt-24 px-6 md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-6 py-6 border-t border-white/5">
              {NAV_ITEMS.map((item, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-4 py-3 border-b border-white/[0.02] text-left transition-colors cursor-pointer ${
                    active === item.id ? 'text-shakti-gold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-[0.3em] font-black">
                    {item.name}
                  </span>
                  {active === item.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-shakti-gold ml-auto" />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto mb-10 text-center">
              <button className="fashion-button w-full py-3.5 text-xs text-center rounded-sm">
                VOGUE MEMBER LOGIN
              </button>
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mt-4 italic">
                Shaktiyug Collective • Infinite Elegance
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
