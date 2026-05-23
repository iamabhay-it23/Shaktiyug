import { motion, AnimatePresence } from 'motion/react';
import { Send, Users, User, ArrowLeft, Shirt, Mic, Sparkles, Volume2, Plus, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ImageSlideshow from './ImageSlideshow';
import ImageGallery from './ImageGallery';

const INITIAL_MESSAGES = [
  { id: 1, sender: "AMAN", role: "Creative Lead", text: "Akash, Mahi, did you finalize the floral patterns for the lotus collection?", timestamp: "11:15 PM" },
  { id: 2, sender: "AKASH", role: "Designer", text: "Yes, the neon pink gradients are looking surreal. We need to sync with the lighting team for the ramp entrance.", timestamp: "11:18 PM" },
  { id: 3, sender: "MAHI", role: "Stylist", text: "The choreography for the walk should mirror the bloom of a flower. Slow at start, high energy at the tip of the ramp.", timestamp: "11:20 PM" },
  { id: 4, sender: "ME", role: "Ramp Specialist", text: "I've practiced the transition. The silk veil will fall exactly at the beat drop. Ready for the collab!", timestamp: "11:22 PM" }
];

const PRESET_STATUSES = [
  "✨ Perfect stance aligned. Ready to sweep the ramp.",
  "✨ Neon pink lotus patterns looking absolute AAA-grade masterpiece.",
  "✨ Transition timed at exactly 128 BPM beat drop sequence.",
  "✨ The holographic aura lights are in 100% synchronicity."
];

export default function BackstageRoom() {
  const [inputText, setInputText] = useState("");
  const [rehearsalMode, setRehearsalMode] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  // Saved Voice Macros State
  const [macros, setMacros] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("shaktiyug_voice_macros");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      "Ready for walk",
      "Transition timing check",
      "Veil drop sequence cue",
      "Sync lights to 128 BPM",
      "Aura trajectory perfect"
    ];
  });
  const [newMacroText, setNewMacroText] = useState("");
  const [isMacroMenuOpen, setIsMacroMenuOpen] = useState(false);

  const handleAddMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMacroText.trim()) return;
    const trimmed = newMacroText.trim();
    if (!macros.includes(trimmed)) {
      const updated = [...macros, trimmed];
      setMacros(updated);
      try {
        localStorage.setItem("shaktiyug_voice_macros", JSON.stringify(updated));
      } catch (e) {}
    }
    setNewMacroText("");
  };

  const handleDeleteMacro = (textToDelete: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = macros.filter(m => m !== textToDelete);
    setMacros(updated);
    try {
      localStorage.setItem("shaktiyug_voice_macros", JSON.stringify(updated));
    } catch (e) {}
  };
  
  // High-performance voice command state factors
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronized scroll trigger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const textStr = textToSend !== undefined ? textToSend : inputText;
    if (!textStr.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "ME",
      role: "Ramp Specialist",
      text: textStr,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    if (textToSend === undefined) {
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Web Speech API initialization with failsafe dynamic simulated support
  const startSpeechToText = () => {
    const SpeechRecognitionVar = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionVar) {
      // Simulate voice matrix directly to enable sandbox compatibility
      setIsSimulating(true);
      setIsListening(true);
      setTranscript("");
      setErrorMsg("");
      return;
    }

    try {
      const rec = new SpeechRecognitionVar();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setErrorMsg("");
        setIsSimulating(false);
      };

      rec.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      rec.onerror = (e: any) => {
        console.warn("Speech recognition error hook triggered:", e);
        if (e.error === 'not-allowed') {
          setErrorMsg("MICROPHONE PERMISSION REJECTED. FALLING BACK TO AURA PRESYNC ENGINE.");
        } else {
          setErrorMsg(`AUDIO DRIVER LOG: ${e.error.toUpperCase()}`);
        }
        setIsSimulating(true);
      };

      rec.onend = () => {
        // Natural silence detection ends recognition
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      setIsSimulating(true);
      setIsListening(true);
      setTranscript("");
    }
  };

  const stopSpeechToText = (shouldSubmit = false) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setIsSimulating(false);

    if (shouldSubmit && transcript.trim() !== "") {
      handleSendMessage(transcript);
    }
    setTranscript("");
  };

  return (
    <section className="min-h-screen py-32 px-6 container mx-auto space-y-20 relative">
      <div className="flex gap-10 min-h-[600px]">
        {/* Sidebar - Rooms */}
        <div className="hidden lg:flex flex-col w-72 bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-[calc(100vh-12rem)]">
          <h3 className="font-serif text-2xl text-white mb-6 italic">Shaktiyug Backstage</h3>
          <div className="space-y-4 overflow-y-auto">
            <div className="p-4 bg-lotus-pink/10 border border-lotus-pink/30 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-lotus-pink" />
                <span className="text-sm font-bold text-white">Main Collab Room</span>
              </div>
              <p className="text-[9px] text-lotus-pink mt-1 uppercase tracking-[0.3em] font-bold">Aman, Akash, Mahi Active</p>
            </div>
            {[1, 2].map(i => (
              <div key={i} className="p-4 hover:bg-white/5 border border-transparent rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/60">Portfolio: Model {i}</span>
                </div>
              </div>
            ))}
            
            <div className="mt-8 pt-6 border-t border-white/5 space-y-4 flex-1 flex flex-col min-h-0">
              <h4 className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-bold">Ramp Monitor</h4>
              <div className="flex-1 relative rounded-sm overflow-hidden border border-lotus-pink/20 bg-black min-h-[200px]">
                <ImageSlideshow className="absolute inset-0 w-full h-full opacity-40 scale-125" />
                <div className="absolute inset-0 bg-shakti-black/40 backdrop-blur-[2px]" />
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-lotus-pink animate-pulse rounded-full" />
                  <span className="text-[7px] uppercase tracking-widest text-white font-black">Live feed</span>
                </div>
              </div>
              
              <h4 className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-bold mt-4">Walk Modes</h4>
              <button 
                onClick={() => setRehearsalMode(!rehearsalMode)}
                className={`w-full p-3 flex items-center justify-between rounded-sm border transition-all ${
                  rehearsalMode ? 'bg-lotus-pink/20 border-lotus-pink text-white shadow-lg shadow-lotus-pink/20' : 'bg-white/5 border-transparent text-white/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shirt className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Ramp Sync</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${rehearsalMode ? 'bg-lotus-pink animate-pulse' : 'bg-white/20'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[#150510] border border-white/5 rounded-2xl overflow-hidden relative backdrop-blur-md">
          {/* Chat Header */}
          <div className="px-8 py-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button className="lg:hidden text-white/60">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h4 className="text-white font-bold tracking-widest text-lg uppercase italic">
                  {rehearsalMode ? 'SHAKTIYUG SHOWDOWN SYNC' : 'Main Collab Room'}
                </h4>
                <p className="text-[9px] uppercase tracking-[0.6em] text-lotus-pink font-black mt-1">
                  {rehearsalMode ? '• RAMP MODE ENFORCED •' : 'Backstage Connectivity Active'}
                </p>
              </div>
            </div>
            
            {/* Sync Protocol Stats */}
            <div className="hidden xl:flex items-center gap-8">
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Beat Sync</div>
                <div className="text-xs font-black text-white">128.4 <span className="text-lotus-pink">BPM</span></div>
              </div>
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Aura Level</div>
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-1 h-3 ${i < 5 ? 'bg-lotus-pink' : 'bg-white/10'}`} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender === "ME" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex flex-col ${rehearsalMode ? 'items-center' : (msg.sender === "ME" ? 'items-end' : 'items-start')}`}
              >
                {!rehearsalMode && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-lotus-pink uppercase tracking-[0.4em]">{msg.sender}</span>
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">#{msg.role}</span>
                  </div>
                )}
                
                <div className={`${rehearsalMode ? 'max-w-2xl text-center' : 'max-w-lg'} p-5 rounded-sm transition-all ${
                  rehearsalMode 
                    ? 'border-none text-white font-serif italic text-2xl drop-shadow-[0_0_10px_rgba(255,45,85,0.3)]' 
                    : (msg.sender === "ME" ? 'bg-lotus-pink/10 border border-lotus-pink/30 text-white shadow-xl shadow-lotus-pink/5' : 'bg-white/[0.03] border border-white/10 text-white/80 shadow-2xl')
                } relative leading-relaxed font-light`}>
                  {rehearsalMode && (
                    <div className="text-[10px] text-lotus-pink uppercase tracking-[0.8em] mb-6 font-black opacity-60">/// {msg.sender} ///</div>
                  )}
                  
                  {rehearsalMode ? msg.text.toUpperCase() : msg.text}
                  
                  {!rehearsalMode && <div className="mt-4 text-[9px] uppercase tracking-[0.4em] opacity-30 text-right font-bold">{msg.timestamp}</div>}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating 'Voice Command' dictation launcher */}
          <motion.button
            onClick={startSpeechToText}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 10px rgba(255,45,85,0.3)",
                "0 0 22px rgba(212,175,55,0.5)",
                "0 0 10px rgba(255,45,85,0.3)"
              ]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-28 right-6 z-30 flex items-center gap-2 py-3.5 px-5 rounded-full bg-gradient-to-r from-lotus-pink via-[#FFD1DC] to-shakti-gold text-shakti-black font-black uppercase text-[9px] tracking-[0.25em] shadow-2xl border border-white/20 cursor-pointer"
          >
            <div className="relative">
              <Mic className="w-3.5 h-3.5 text-black" fill="currentColor" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E0115F] rounded-full animate-ping" />
            </div>
            <span>VOICE COMMAND</span>
          </motion.button>

          {/* Overlay Listening HUD Panel */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-shakti-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 select-none"
              >
                {/* Volumetric ambient radiant backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-lotus-pink/15 rounded-full blur-[80px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-shakti-gold/10 rounded-full blur-[100px]" />

                {/* Cyber HUD circle */}
                <div className="relative w-44 h-44 flex items-center justify-center mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-lotus-pink/30"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-3 rounded-full border border-double border-shakti-gold/20"
                  />
                  
                  {/* Micro Core */}
                  <motion.div
                    animate={{
                      scale: [1, 1.12, 1],
                      backgroundColor: ["rgba(255, 45, 85, 0.12)", "rgba(212, 175, 55, 0.22)", "rgba(255, 45, 85, 0.12)"]
                    }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full flex items-center justify-center border border-white/5 shadow-2xl relative z-10"
                  >
                    {isSimulating ? (
                      <Sparkles className="w-8 h-8 text-shakti-gold animate-pulse" />
                    ) : (
                      <Mic className="w-8 h-8 text-lotus-pink animate-bounce" fill="currentColor" />
                    )}
                  </motion.div>

                  {/* 120fps physics voice bars */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1].map((bar, idx) => (
                      <motion.div
                        key={idx}
                        animate={{
                          height: [
                            8, 
                            Math.random() * (isSimulating ? 36 : 24) + 8, 
                            8
                          ]
                        }}
                        transition={{
                          duration: 0.35 + idx * 0.03,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-0.75 rounded-full bg-gradient-to-t from-lotus-pink to-shakti-gold"
                        style={{ height: '8px' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Metadata texts */}
                <h3 className="font-serif text-2xl tracking-[0.15em] uppercase gold-text italic text-center mb-1.5 z-10 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-shakti-gold animate-pulse" />
                  {isSimulating ? "AI Voice Matrix Simulator" : "Listening to Voice Transmitting..."}
                </h3>
                <p className="text-[8px] tracking-[0.4em] text-white/40 uppercase font-mono mb-6 z-10 text-center">
                  {isSimulating ? "MICROPHONE FALLBACK STREAM ENABLED • TAP CHAT SAMPLES" : "TALK NOW • STATUS STREAM WILL DICTATE ONLINE"}
                </p>

                {/* Transcript Bubble */}
                <div className="w-full max-w-lg bg-white/[0.02] border border-white/5 rounded-xl p-5 mb-6 backdrop-blur-3xl text-center min-h-[90px] flex flex-col justify-center items-center relative z-10">
                  {errorMsg ? (
                    <p className="text-[10px] text-lotus-pink uppercase tracking-widest font-black leading-snug">{errorMsg}</p>
                  ) : (
                    <p className="font-sans text-xs tracking-wider text-white font-light italic leading-relaxed">
                      {transcript || (isSimulating ? "Select an instant design comment preset below or type a custom command!" : "Waiting for audio signal...")}
                    </p>
                  )}
                </div>

                {/* Custom Simulated Matrix fallbacks */}
                {isSimulating && (
                  <div className="w-full max-w-md space-y-3 mb-6 z-10">
                    <div className="text-[8px] uppercase tracking-[0.3em] text-white/30 text-center font-bold">CHOOSE DICTATION TEMPLATE:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {PRESET_STATUSES.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => setTranscript(preset)}
                          className="p-3 text-left bg-white/[0.03] hover:bg-lotus-pink/10 border border-white/5 hover:border-lotus-pink/30 rounded-lg text-[9px] text-white/80 hover:text-white transition-all overflow-hidden text-ellipsis whitespace-nowrap uppercase tracking-widest font-semibold"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="relative mt-2">
                      <input
                        type="text"
                        placeholder="ENTER QUICK CUSTOM STATEMENT DICTATE..."
                        className="w-full bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-full py-3.5 px-6 text-[10px] uppercase tracking-[0.2em] font-black outline-none text-white text-center focus:border-lotus-pink/30"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex gap-4 z-10">
                  <button
                    onClick={() => stopSpeechToText(false)}
                    className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-[9px] uppercase tracking-[0.25em] font-bold hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => stopSpeechToText(true)}
                    disabled={!transcript || transcript.trim() === ""}
                    className={`px-8 py-2.5 rounded-full text-shakti-black text-[9px] uppercase tracking-[0.25em] font-black transition-all cursor-pointer shadow-lg ${
                      transcript && transcript.trim() !== ""
                        ? "bg-gradient-to-r from-lotus-pink to-shakti-gold hover:scale-105"
                        : "bg-white/10 text-white/20 cursor-not-allowed border border-white/5"
                    }`}
                  >
                    SUBMIT STATUS UPDATE
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice Macro Menu Panel */}
          <div className="border-t border-white/5 bg-[#170613]/90 backdrop-blur-md">
            <div 
              onClick={() => setIsMacroMenuOpen(!isMacroMenuOpen)}
              className="px-8 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-sm bg-gradient-to-tr from-lotus-pink to-shakti-gold p-[1px]">
                  <div className="w-full h-full rounded-sm bg-shakti-black flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-shakti-gold animate-pulse" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white font-black">Voice Macros Preset Deck</span>
                  <span className="text-[8px] uppercase tracking-widest text-shakti-gold ml-3 font-mono inline-block bg-white/[0.04] px-1.5 py-0.5 rounded-sm border border-shakti-gold/20">• {macros.length} Loaded</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5">
                <span className="text-[8.5px] uppercase tracking-[0.15em] text-white/40 font-mono">
                  {isMacroMenuOpen ? "CLOSE MACRO BOARD" : "EXPAND PRESETS"}
                </span>
                <motion.span 
                  animate={{ rotate: isMacroMenuOpen ? 180 : 0 }} 
                  className="inline-block text-white/50 text-[10px] font-bold"
                >
                  ▲
                </motion.span>
              </div>
            </div>

            <AnimatePresence>
              {isMacroMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-white/5"
                >
                  <div className="px-8 pb-6 pt-4 space-y-4 font-sans text-xs">
                    {/* Grid of existing macros */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {macros.map((macro, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSendMessage(macro)}
                          className="p-3 bg-white/[0.02] hover:bg-lotus-pink/10 border border-white/5 hover:border-lotus-pink/30 rounded-md flex items-center justify-between group cursor-pointer transition-all"
                        >
                          <span className="text-[10px] text-white/80 group-hover:text-white uppercase tracking-wider font-semibold truncate pr-3 select-none">
                            💬 {macro}
                          </span>
                          
                          <button
                            onClick={(e) => handleDeleteMacro(macro, e)}
                            className="text-white/20 hover:text-lotus-pink hover:scale-110 transition-all p-1.5 rounded-sm hover:bg-white/5"
                            title="Delete custom macro"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add custom macro form */}
                    <form onSubmit={handleAddMacro} className="flex gap-2 items-center bg-white/[0.01] border border-white/5 hover:border-white/10 p-2 rounded-md transition-all">
                      <div className="flex-1 flex items-center gap-2 px-3">
                        <Plus className="w-3.5 h-3.5 text-white/30" />
                        <input
                          type="text"
                          placeholder="PRESERVE CUSTOM MACRO STATEMENT..."
                          className="flex-1 bg-transparent border-none text-[9.5px] uppercase tracking-[0.15em] font-bold text-white outline-none focus:placeholder-white/20 placeholder:text-white/15"
                          value={newMacroText}
                          onChange={(e) => setNewMacroText(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newMacroText.trim()}
                        className="px-4 py-2.5 bg-gradient-to-r from-lotus-pink to-shakti-gold text-shakti-black text-[9px] uppercase tracking-[0.15em] font-black hover:opacity-95 disabled:opacity-25 transition-all cursor-pointer rounded-sm flex items-center gap-1.5 shadow-lg"
                      >
                        <span>ADD DECK</span>
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Typing Input */}
          <div className="p-8 bg-shakti-black/60 border-t border-white/5 backdrop-blur-2xl">
            <div className="relative flex items-center bg-white/[0.02] rounded-full border border-white/5 focus-within:border-lotus-pink/50 transition-all shadow-inner">
              <input 
                type="text"
                placeholder="STYLE YOUR VIBE..."
                className="w-full bg-transparent border-none outline-none py-4 px-8 text-xs uppercase tracking-[0.3em] font-bold placeholder:text-white/10"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={() => handleSendMessage()}
                className="mr-3 p-3 bg-lotus-pink rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-lg shadow-lotus-pink/40 border border-white/10 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <p className="text-[8px] uppercase tracking-[0.6em] text-white/10 font-bold">MODE: COLLABORATION • STATUS: FABULOUS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <ImageGallery title="Backstage Moodboards" />
    </section>
  );
}
