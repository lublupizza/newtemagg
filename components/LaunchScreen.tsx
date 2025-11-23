
import React, { useState, useEffect } from 'react';
import { Rocket, Star, Zap } from 'lucide-react';

const LaunchScreen: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev; // Stop at 0
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ val, label, showRing = false, max = 60 }: { val: number, label: string, showRing?: boolean, max?: number }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    // Calculate offset: progress decreases as time decreases
    const progress = val / max;
    const offset = circumference - (progress * circumference);

    return (
      <div className="flex flex-col items-center mx-2 md:mx-4 relative group">
        <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
            
            {/* Progress Ring (Only for specified units) */}
            {showRing && (
                <svg className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] rotate-[-90deg] pointer-events-none" viewBox="0 0 100 100">
                    <circle 
                        cx="50" cy="50" r={radius} 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="3"
                    />
                    <circle 
                        cx="50" cy="50" r={radius}
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
            )}

            <div className={`
                w-16 h-16 md:w-24 md:h-24 
                bg-gray-800/50 border border-purple-500/30 rounded-2xl 
                flex items-center justify-center backdrop-blur-md 
                shadow-[0_0_20px_rgba(168,85,247,0.2)]
                group-hover:scale-105 transition-transform duration-300
                ${label === 'Секунд' ? 'shadow-[0_0_30px_rgba(168,85,247,0.4)]' : ''}
            `}>
                {/* Flip Animation Key */}
                <span 
                    key={val}
                    className="text-2xl md:text-5xl font-mono font-black text-white animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
                >
                    {val.toString().padStart(2, '0')}
                </span>
            </div>
        </div>
        
        {/* Label with pulse */}
        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2 ${label === 'Секунд' ? 'text-white animate-pulse' : 'text-purple-400'}`}>
            {label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
      
      {/* Space Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e1b4b_0%,#000_70%)]"></div>
         {/* Stars */}
         <div className="absolute top-10 left-20 text-white/20 animate-pulse"><Star size={10} /></div>
         <div className="absolute top-40 right-40 text-white/30 animate-pulse delay-700"><Star size={14} /></div>
         <div className="absolute bottom-20 left-1/3 text-white/10 animate-pulse delay-300"><Star size={8} /></div>
         
         {/* Grid Floor */}
         <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(168,85,247,0.1)_50%,rgba(168,85,247,0.3))] transform perspective-1000 rotate-x-60"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
         
         {/* ROCKET CONTAINER */}
         <div className="relative mb-12">
             {/* Thrust Flame */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-32 bg-gradient-to-t from-transparent via-orange-500 to-yellow-400 blur-xl opacity-80 animate-[pulse_0.2s_infinite]"></div>
             
             {/* Rocket Icon */}
             <div className="relative animate-[shake_0.5s_ease-in-out_infinite]">
                 <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full"></div>
                 <Rocket className="w-32 h-32 md:w-48 md:h-48 text-white fill-gray-900 stroke-[1.5] drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] transform -rotate-45" />
             </div>
             
             {/* Particles */}
             <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-white rounded-full animate-[flyParticle_1s_infinite] delay-100"></div>
             <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-orange-300 rounded-full animate-[flyParticle_1.2s_infinite] delay-300"></div>
         </div>

         <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-900/30 border border-purple-500/50 rounded-full text-purple-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4">
             <Zap className="w-3 h-3 animate-bounce" /> System Pre-Check: OK
         </div>

         <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-500 mb-8 tracking-tighter drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
             СКОРО ЗАПУСК
         </h1>

         {/* TIMER */}
         <div className="flex justify-center mb-12 items-start flex-wrap gap-y-6">
             <TimeUnit val={timeLeft.days} label="Дней" />
             <div className="text-4xl font-black text-gray-600 mt-8 hidden md:block">:</div>
             <TimeUnit val={timeLeft.hours} label="Часов" max={24} />
             <div className="text-4xl font-black text-gray-600 mt-8 hidden md:block">:</div>
             <TimeUnit val={timeLeft.minutes} label="Минут" max={60} />
             <div className="text-4xl font-black text-gray-600 mt-8 hidden md:block">:</div>
             <TimeUnit val={timeLeft.seconds} label="Секунд" showRing={true} max={60} />
         </div>

         <p className="text-gray-400 font-mono text-sm md:text-base max-w-md mx-auto border-l-2 border-purple-500 pl-4">
             Мы готовим что-то невероятное. Двигатели прогреты, пицца загружена. Ожидайте старт миссии.
         </p>

      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateY(0) rotate(-45deg); }
          25% { transform: translateY(-2px) translateX(1px) rotate(-44deg); }
          75% { transform: translateY(2px) translateX(-1px) rotate(-46deg); }
        }
        @keyframes flyParticle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate((Math.random() - 0.5) * 50px, 100px) scale(0); opacity: 0; }
        }
        @keyframes slideUp {
            0% { transform: translateY(10px) scale(0.9); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LaunchScreen;
