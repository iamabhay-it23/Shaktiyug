import { motion } from 'motion/react';
import { User, Award, Briefcase, TrendingUp, Star, Phone, Mail, Instagram } from 'lucide-react';
import ImageSlideshow from './ImageSlideshow';
import ImageGallery from './ImageGallery';

const STATS = [
  { label: 'Walks', value: '42', icon: Star },
  { label: 'Collabs', value: '18', icon: Award },
  { label: 'Growth', value: '+12%', icon: TrendingUp },
];

const RECENT_COLLABS = [
  { name: 'Aman Couture', role: 'Showstopper', date: 'Oct 2025' },
  { name: 'Mahi Styles', role: 'Editorial', date: 'Sep 2025' },
  { name: 'Akash Neo', role: 'Ramp', date: 'Aug 2025' },
];

export default function ProfileDashboard() {
  return (
    <section className="min-h-screen py-32 px-6 container mx-auto">
      <div className="flex flex-col mb-16">
        <h2 className="font-serif text-5xl md:text-8xl italic mb-4 gold-text">Me. Shakti.</h2>
        <div className="h-[2px] bg-gradient-to-r from-shakti-gold to-transparent w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[3/4] rounded-sm overflow-hidden border border-shakti-gold/20 group luxury-card"
          >
            <img 
              src="https://i.pinimg.com/736x/ae/90/f5/ae90f5ed75ec750890911876faf7bfdb.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-shakti-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-4xl text-white italic">Vogue Artist</h3>
              <p className="text-[10px] uppercase tracking-[0.5em] text-shakti-gold font-black mt-2">Level: Professional</p>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">Contact Data</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs text-shakti-gold-light">
                <Mail className="w-3 h-3 text-shakti-gold" />
                <span>vogue@shaktiyug.com</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-shakti-gold-light">
                <Phone className="w-3 h-3 text-shakti-gold" />
                <span>+91 9988-Shakti</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-shakti-gold-light">
                <Instagram className="w-3 h-3 text-shakti-gold" />
                <span>@shakti_vogue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Features */}
        <div className="lg:col-span-2 space-y-12">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 p-6 rounded-sm text-center group hover:border-shakti-gold/30 transition-colors luxury-card"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-shakti-gold/60 group-hover:text-shakti-gold transition-colors" />
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Growth Chart Placeholder */}
          <div className="bg-white/[0.01] border border-white/5 p-8 rounded-sm luxury-card">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-serif text-2xl text-white italic">Aura Trajectory</h4>
              <div className="text-[8px] uppercase tracking-[0.3em] text-shakti-gold font-bold">Weekly Performance</div>
            </div>
            <div className="h-48 flex items-end gap-2 px-4">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  className="flex-1 bg-shakti-gold/10 border-t-2 border-shakti-gold/60 group relative cursor-pointer"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-shakti-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Portfolio Highlights Slideshow */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">Ramp Highlights Archive</h4>
            <ImageSlideshow className="aspect-video w-full rounded-sm shadow-2xl shadow-shakti-gold/5" />
          </div>

          <ImageGallery title="Personal Visual Journey" />

          {/* Recent Collabs */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">Recent Collaborations</h4>
            <div className="space-y-4">
              {RECENT_COLLABS.map((collab, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors luxury-card">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-shakti-gold/10 flex items-center justify-center text-shakti-gold font-bold">
                      {collab.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{collab.name}</div>
                      <div className="text-[9px] uppercase tracking-widest text-white/30">{collab.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-white/60">{collab.date}</div>
                    <button className="text-[8px] text-shakti-gold uppercase tracking-widest hover:underline">View Result</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
