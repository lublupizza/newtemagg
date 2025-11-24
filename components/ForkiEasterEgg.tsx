
import React from 'react';
import { X, Terminal, Code2, Sparkles } from 'lucide-react';

interface ForkiEasterEggProps {
  onClose: () => void;
}

const ForkiEasterEgg: React.FC<ForkiEasterEggProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer overflow-hidden animate-in fade-in duration-300" 
        onClick={onClose}
    >
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e1b4b_0%,#000_80%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* --- MAIN CARD --- */}
      <div 
        className="relative z-10 w-full max-w-lg mx-4 bg-black/80 border border-pink-500/30 rounded-[2rem] p-12 shadow-[0_0_80px_rgba(236,72,153,0.2)] flex flex-col items-center text-center animate-in zoom-in-90 duration-500 slide-in-from-bottom-8 backdrop-blur-xl overflow-hidden group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Corner Accents */}
        <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-pink-500 rounded-tl-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-pink-500 rounded-tr-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-pink-500 rounded-bl-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-pink-500 rounded-br-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>

        {/* Central Icon with Spin Ring */}
        <div className="relative mb-10">
            <div className="absolute inset-[-10px] border-2 border-dashed border-pink-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                <Terminal className="w-10 h-10 text-pink-400" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-cyan-400 animate-bounce" />
        </div>

        {/* Typography */}
        <h2 className="text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 tracking-tighter mb-2 drop-shadow-lg animate-[pulse_3s_infinite]">
            FORKI
        </h2>
        
        <div className="flex items-center justify-center gap-4 w-full mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-30"></div>
            <span className="text-2xl md:text-3xl font-mono font-bold text-white tracking-[0.5em] uppercase" style={{ textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>
                STYLE
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-30"></div>
        </div>

        {/* Badges */}
        <div className="flex gap-3 flex-wrap justify-center">
            <div className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                <Code2 className="w-3 h-3" /> Development
            </div>
            <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Design
            </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};

export default ForkiEasterEgg;
