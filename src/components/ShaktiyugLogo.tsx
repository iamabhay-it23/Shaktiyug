import { Flower2 } from 'lucide-react';

export default function ShaktiyugLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12 overflow-hidden rounded-full border border-white/10">
        <img 
          src="https://i.pinimg.com/736x/1b/50/3d/1b503df1359e139abcea3569b5600baf.jpg" 
          alt="Shaktiyug Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="font-serif text-3xl font-black tracking-tighter uppercase italic gold-text">
          Shaktiyug
        </span>
        <span className="text-[7px] uppercase tracking-[0.5em] text-shakti-gold/60 font-black">
          Couture Collective • Est 2026
        </span>
      </div>
    </div>
  );
}
