
import React from 'react';
import { Bot, Wrench, ShieldAlert, Binary, Cpu } from 'lucide-react';

const MaintenanceScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
      
      {/* Cyber Background Effects */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#000,#111)]"></div>
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 animate-[scan_3s_linear_infinite]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-gray-900/80 border border-red-500/30 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-[0_0_100px_rgba(220,38,38,0.2)] flex flex-col items-center">
         
         {/* Animated Icon */}
         <div className="relative mb-8">
             <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
             <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-red-500 flex items-center justify-center relative overflow-hidden shadow-2xl">
                 <Bot className="w-16 h-16 text-red-400 animate-bounce" />
                 
                 {/* Glitch Overlay */}
                 <div className="absolute inset-0 bg-red-500/20 animate-[pulse_0.2s_infinite] opacity-0 hover:opacity-100"></div>
             </div>
             <div className="absolute -right-4 -top-4 bg-yellow-500 text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                 System Locked
             </div>
         </div>

         <h1 className="text-4xl md:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-6 tracking-tighter drop-shadow-lg">
             ТЕХ. РАБОТЫ
         </h1>

         <div className="space-y-4 mb-8">
             <p className="text-xl md:text-2xl text-white font-bold">
                 Привет, кибер-котлета! 🤖
             </p>
             <p className="text-gray-400 font-mono text-sm md:text-base leading-relaxed max-w-md mx-auto border-l-2 border-red-500 pl-4">
                 Сейчас поиграть не получится, идут технические работы. 
                 Скоро все заработает (надеемся).
             </p>
         </div>

         {/* Animated Gears / Tech Visuals */}
         <div className="flex gap-8 opacity-50">
             <Wrench className="w-8 h-8 text-gray-600 animate-[spin_4s_linear_infinite]" />
             <Cpu className="w-8 h-8 text-gray-600 animate-pulse" />
             <Binary className="w-8 h-8 text-gray-600 animate-[pulse_2s_linear_infinite]" />
         </div>

         <div className="mt-12 w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
             <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
         </div>
         <p className="text-[10px] text-gray-600 font-mono mt-2 uppercase tracking-[0.3em]">Updating Core Systems...</p>

      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceScreen;
