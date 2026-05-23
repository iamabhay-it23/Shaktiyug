import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, User, Sparkles, Key, Mail, Lock, CheckCircle } from 'lucide-react';

interface VogueLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
}

export default function VogueLoginModal({ isOpen, onClose, onLoginSuccess }: VogueLoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student Creator');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !name) {
      setError('Please supply both your Identification Name/Alias and Email.');
      return;
    }

    if (role === 'owner') {
      if (passcode.toLowerCase() !== 'shakti2026' && passcode.toLowerCase() !== 'admin') {
        setError("Invalid secure protocol key. For demo, try passcode: shakti2026");
        return;
      }
    }

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role
    };

    setSuccess(isSignUp ? 'Vogue Identity registered successfully!' : 'Assemblage complete. Welcome Back backstage!');
    
    setTimeout(() => {
      onLoginSuccess(userData);
      // Clean up states
      setName('');
      setEmail('');
      setPasscode('');
      setRole('Student Creator');
      setSuccess('');
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#090308]/92 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-[#0c050a]/95 border border-shakti-gold/30 rounded-xs shadow-2xl p-6 md:p-8 overflow-hidden font-sans z-10"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -left-20 -top-20 w-44 h-44 bg-shakti-gold/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-44 h-44 bg-[#ff2d55]/5 blur-3xl rounded-full pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer p-1.5 border border-white/5 hover:border-white/10 rounded-full"
              title="Close System Portal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo Silhouette */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff2d55] to-shakti-gold p-[1px] mb-3 animate-pulse">
                <div className="w-full h-full rounded-full bg-shakti-black flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-shakti-gold" />
                </div>
              </div>
              <h3 className="font-serif text-2xl italic text-white leading-tight">
                {isSignUp ? 'Forge Custom Session' : 'Assemble Backstage Sync'}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mt-1.5">
                Shaktiyug Authentic Identity Protocol
              </p>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-white/10 pb-1.5 mb-6 gap-6 justify-center">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(''); }}
                className={`text-[10px] uppercase tracking-widest font-black transition-all pb-1.5 border-b cursor-pointer ${
                  !isSignUp ? 'border-shakti-gold text-shakti-gold' : 'border-transparent text-white/40 hover:text-white'
                }`}
              >
                Assemble Session
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(''); }}
                className={`text-[10px] uppercase tracking-widest font-black transition-all pb-1.5 border-b cursor-pointer ${
                  isSignUp ? 'border-shakti-gold text-shakti-gold' : 'border-transparent text-white/40 hover:text-white'
                }`}
              >
                Register Identity
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Alias input */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-white/40 font-black block">Alias / Creator Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/20">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AMAN_CREATOR"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-shakti-gold rounded-xs py-2 px-3 pl-10 text-xs text-white placeholder:text-white/20 outline-none uppercase font-mono tracking-wider"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-white/40 font-black block">Email Coordinates</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/20">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@shaktiyug.com"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-shakti-gold rounded-xs py-2 px-3 pl-10 text-xs text-white placeholder:text-white/20 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Session Guild/Role */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-white/40 font-black block">Guild Alliance / Role</label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-[#080307] border border-white/10 focus:border-shakti-gold text-white text-xs rounded-xs py-2 px-3 outline-none cursor-pointer"
                  >
                    <option value="Student Creator">Student Creator (Portfolio Workspace)</option>
                    <option value="Model Companion">Model Companion (Aura Auditionee)</option>
                    <option value="owner">Platform Owner (Executive Control Node)</option>
                  </select>
                </div>
              </div>

              {/* Passcode (Only if owner) */}
              <AnimatePresence>
                {role === 'owner' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-[9px] uppercase tracking-widest text-white/40 font-black block">Secure Security Token Passcode</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/20">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        required
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="ENTER MASTER CODE (shakti2026)"
                        className="w-full bg-white/[0.03] border border-[#ff2d55]/30 focus:border-shakti-gold rounded-xs py-2 px-3 pl-10 text-xs text-white placeholder:text-white/20 outline-none font-mono"
                      />
                    </div>
                    <span className="text-[8px] text-shakti-gold/50 block font-mono">⚠️ Security Notice: Enter "shakti2026" or "admin" to authorize dashboard administrative functions.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Feedbacks */}
              {error && (
                <div className="p-2.5 bg-[#ff2d55]/10 border border-[#ff2d55]/35 text-[#ff2d55] text-[9.5px] font-mono rounded-xs uppercase tracking-wider text-center">
                  ⚠️ Validation Error: {error}
                </div>
              )}

              {success && (
                <div className="p-2.5 bg-green-500/10 border border-green-500/35 text-green-400 text-[9.5px] font-mono rounded-xs uppercase tracking-wider text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#ff2d55] to-shakti-gold text-shakti-black text-[9.5px] uppercase tracking-[0.2em] font-black hover:opacity-90 active:scale-95 transition-all rounded-xs mt-3 cursor-pointer select-none"
              >
                {isSignUp ? 'Publish Core Identity' : 'Suture Vogue Session'}
              </button>
            </form>

            {/* Decorative Slogan */}
            <p className="text-center text-[8px] text-white/20 uppercase tracking-[0.3em] mt-6 select-none leading-relaxed">
              Infinite Threads • Dynamic Couture Integration
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
