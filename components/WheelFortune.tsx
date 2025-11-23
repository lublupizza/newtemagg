
import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { Sparkles, Disc, Star } from 'lucide-react';

interface WheelFortuneProps {
  language: Language;
  onWin: (prize: string, value: number) => void;
}

const WheelFortune: React.FC<WheelFortuneProps> = ({ language, onWin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<string | null>(null);
  
  const wheelRef = useRef<HTMLDivElement>(null);

  const SEGMENTS = [
    { label: '50 PTS', value: 50, color: '#EC4899', type: 'points' },
    { label: '10% OFF', value: 10, color: '#8B5CF6', type: 'discount' },
    { label: '100 PTS', value: 100, color: '#3B82F6', type: 'points' },
    { label: 'FREE DRINK', value: 0, color: '#10B981', type: 'item' },
    { label: '25 PTS', value: 25, color: '#F59E0B', type: 'points' },
    { label: 'SPIN AGAIN', value: -1, color: '#6366F1', type: 'retry' },
    { label: '500 PTS', value: 500, color: '#EF4444', type: 'points' }, // Rare
    { label: '5% OFF', value: 5, color: '#14B8A6', type: 'discount' },
  ];

  const t = {
    title: language === 'ru' ? 'КОЛЕСО УДАЧИ' : 'LUCKY WHEEL',
    spin: language === 'ru' ? 'КРУТИТЬ' : 'SPIN',
    spinning: language === 'ru' ? 'УДАЧА...' : 'LUCK...',
    won: language === 'ru' ? 'ВЫ ВЫИГРАЛИ:' : 'YOU WON:',
    limit: language === 'ru' ? 'Один спин в день' : 'One free spin daily'
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrize(null);

    // Random degree (at least 5 full spins + random segment)
    // 360 / 8 = 45 deg per segment
    const randomSegment = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    
    // We add extra rotation to ensure it lands in the center of the segment
    const stopAngle = 360 * 8 + (360 - (randomSegment * segmentAngle)); 
    
    const newRotation = rotation + stopAngle;
    setRotation(newRotation);

    // Wait for animation to end (5s ease-out)
    setTimeout(() => {
      setIsSpinning(false);
      const winningSegment = SEGMENTS[randomSegment];
      setPrize(winningSegment.label);
      if (winningSegment.type !== 'retry') {
          onWin(winningSegment.label, winningSegment.value);
      }
    }, 5000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 flex flex-col items-center justify-center min-h-[600px]">
       
       {/* HEADER */}
       <div className="text-center mb-12">
           <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 neon-text tracking-tighter mb-2">
               {t.title}
           </h2>
           <p className="text-gray-400 font-mono uppercase tracking-[0.3em] flex items-center justify-center gap-2">
               <Sparkles className="w-4 h-4 text-yellow-400" /> {t.limit}
           </p>
       </div>

       {/* WHEEL CONTAINER */}
       <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
           
           {/* Outer Glow Ring */}
           <div className="absolute inset-[-20px] rounded-full border-4 border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.3)] animate-pulse"></div>
           
           {/* Pointer */}
           <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"></div>

           {/* THE WHEEL */}
           <div 
             ref={wheelRef}
             className="w-full h-full rounded-full border-8 border-gray-800 relative overflow-hidden shadow-2xl bg-gray-900 transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)"
             style={{ transform: `rotate(${rotation}deg)` }}
           >
               {SEGMENTS.map((seg, i) => {
                   const rotate = (360 / SEGMENTS.length) * i;
                   const skew = 90 - (360 / SEGMENTS.length);
                   return (
                       <div 
                         key={i}
                         className="absolute top-0 right-0 w-[50%] h-[50%] origin-bottom-left flex items-center justify-center"
                         style={{ 
                             transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
                             background: i % 2 === 0 ? seg.color : `linear-gradient(to bottom, ${seg.color}, #111)`,
                             border: '1px solid rgba(255,255,255,0.1)'
                         }}
                       >
                           <div 
                             className="absolute bottom-4 left-4 text-white font-black text-sm md:text-lg whitespace-nowrap"
                             style={{ 
                                 transform: `skewY(${skew}deg) rotate(${360/SEGMENTS.length/2}deg) translate(60px, 0px) rotate(90deg)`,
                                 textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                             }}
                           >
                               {seg.label}
                           </div>
                       </div>
                   );
               })}
           </div>

           {/* Center Cap */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-900 rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center">
               <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 animate-spin-slow" />
           </div>
       </div>

       {/* CONTROLS */}
       <div className="mt-12 flex flex-col items-center gap-4">
           {!prize ? (
               <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`px-12 py-5 rounded-full font-black text-2xl tracking-widest transition-all transform ${
                      isSpinning 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-yellow-400 hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                  }`}
               >
                   {isSpinning ? t.spinning : t.spin}
               </button>
           ) : (
               <div className="text-center animate-[fadeIn_0.5s_ease-out]">
                   <div className="text-gray-400 font-mono text-sm mb-2">{t.won}</div>
                   <div className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_15px_gold] mb-6">
                       {prize}
                   </div>
                   <button 
                     onClick={spinWheel}
                     className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-black transition-colors"
                   >
                       {t.spin} AGAIN
                   </button>
               </div>
           )}
       </div>

    </div>
  );
};

export default WheelFortune;
