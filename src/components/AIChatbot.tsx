import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { MessageSquare, X, Send, Mic, MicOff, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: "Welcome, Creator. I am Shakti, your design & backstage companion here at Shaktiyug. How can I assist you with your queries, auditions, or collections today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const dragControls = useDragControls();
  const [dragConstraints, setDragConstraints] = useState({ left: -600, right: 100, top: -600, bottom: 100 });

  useEffect(() => {
    const updateConstraints = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const maxLeft = -(windowWidth - 384 - 24 - 16);
      const maxRight = 16;
      const maxTop = -(windowHeight - 500 - 96 - 16);
      const maxBottom = 80;

      setDragConstraints({
        left: Math.min(0, maxLeft),
        right: maxRight,
        top: Math.min(0, maxTop),
        bottom: maxBottom
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle Speech Recognition
  useEffect(() => {
    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? prev + ' ' : '') + transcript);
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser environment. Please update or use Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSpeak = (text: string) => {
    if (isMuted) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[\*\#\_]/g, ''));
      u.rate = 1.05;
      u.pitch = 0.95;
      // Seek a premium high-quality voice if available
      const voices = window.speechSynthesis.getVoices();
      const selected = voices.find(v => v.name.includes("Google US English") || v.name.includes("Natural"));
      if (selected) u.voice = selected;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    setInputText('');

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMessageText,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText })
      });
      const data = await response.json();
      
      const replyText = data.response;
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date()
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, assistantMsg]);
      handleSpeak(replyText);
    } catch (error) {
      console.error("Failed to query AI chatbot", error);
      setIsTyping(false);
      const errReply = "My aura link encountered a glitch. However, your creative output is majestic. Speak to me again shortly!";
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: errReply,
          timestamp: new Date()
        }
      ]);
      handleSpeak(errReply);
    }
  };

  return (
    <>
      {/* Floating Action Launch Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="ai-launch-btn"
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-lotus-pink via-shakti-gold to-lotus-pink p-[1px] shadow-[0_0_30px_rgba(224,17,95,0.4)] relative flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <div className="absolute inset-0 rounded-full bg-shakti-black flex items-center justify-center">
            {isOpen ? (
              <X className="w-5 h-5 text-shakti-gold" />
            ) : (
              <div className="relative">
                <MessageSquare className="w-5 h-5 text-shakti-gold" />
                <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-lotus-pink animate-pulse" />
              </div>
            )}
          </div>
        </motion.button>
      </div>

      {/* Main Chat Interface Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            drag
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-[#0c050a]/95 border border-shakti-gold/30 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-2xl pointer-events-auto touch-none"
          >
            {/* Header */}
            <div 
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
                dragControls.start(e);
              }}
              className="p-4 border-b border-white/10 bg-gradient-to-r from-shakti-black via-[#140810] to-shakti-black flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-gradient-to-tr from-lotus-pink to-shakti-gold p-[1px]">
                  <div className="w-full h-full rounded-sm bg-shakti-black flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-shakti-gold" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-serif italic text-white tracking-widest uppercase">SHAKTI</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[7.5px] uppercase tracking-[0.25em] text-white/40 font-mono">INTELLIGENCE MATRIX ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Speech Output Controls */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-sm border transition-colors ${
                  isMuted ? 'border-white/5 text-white/30' : 'border-shakti-gold/30 text-shakti-gold bg-shakti-gold/5'
                }`}
                title={isMuted ? "Click to unmute Oracle voice" : "Mute Oracle voice"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce" />}
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-sm leading-relaxed tracking-wide ${
                      msg.sender === 'user'
                        ? 'bg-shakti-gold/10 border border-shakti-gold/30 text-white rounded-br-none font-medium'
                        : 'bg-white/[0.03] border border-white/5 text-white/90 rounded-bl-none font-light'
                    }`}
                  >
                    {msg.text}
                    <div className="text-[7px] text-white/20 tracking-widest text-right mt-1 font-mono uppercase">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] border border-white/5 px-4 py-3 rounded-sm rounded-bl-none">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-shakti-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-shakti-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-shakti-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Field Controls */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-shakti-black flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-sm border transition-all duration-300 ${
                  isListening
                    ? 'bg-lotus-pink/20 border-lotus-pink text-lotus-pink shadow-[0_0_10px_rgba(224,17,95,0.3)] animate-pulse'
                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white'
                }`}
                title="Microphone Dictate"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Listening with elegance..." : "Ask Shakti anything..."}
                className="flex-1 bg-white/[0.03] border border-white/10 p-2.5 rounded-sm text-xs text-white placeholder-white/20 tracking-wider focus:border-shakti-gold outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-sm bg-gradient-to-tr from-shakti-gold to-shakti-gold-light text-shakti-black hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 font-black" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
