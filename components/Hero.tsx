
import React from 'react';
import { AppView, Language, User, PromoItem } from '../types';
import { Heart, Fingerprint, Zap, Moon, ShoppingBag, ArrowRight, Clock, Star, Flame, Gamepad2 } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: AppView) => void;
  onAuth: () => void;
  language: Language;
  user?: User;
  promos?: PromoItem[];
}

const FloatingCard = ({ promo, language }: { promo: PromoItem, language: Language }) => {
  // Map string iconType to actual component
  const getIcon = (type: string) => {
      switch(type) {
          case 'zap': return <Zap className="w-8 h-8 text-cyan-300" />;
          case 'gamepad': return <Gamepad2 className="w-8 h-8 text-purple-300" />;
          case 'moon': return <Moon className="w-8 h-8 text-orange-300" />;
          default: return <Star className="w-8 h-8 text-white" />;
      }
  };

  return (
    <div 
        className={`
        relative flex flex-col items-center justify-center p-6 w-64 h-40 rounded-3xl border backdrop-blur-md 
        bg-gradient-to-br ${promo.bg} ${promo.color} 
        animate-[float_5s_ease-in-out_infinite] cursor-pointer group transition-all duration-300 hover:scale-105 hover:z-20 hover:bg-opacity-80
        `}
        style={{ animationDelay: promo.delay }}
    >
        {/* Top Connector Line */}
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-gradient-to-b from-transparent to-${promo.text.split('-')[1]} opacity-50`}></div>

        <div className={`p-3 rounded-full bg-black/40 border border-white/10 shadow-inner mb-3 group-hover:scale-110 transition-transform`}>
            {getIcon(promo.iconType)}
        </div>
        
        <h3 className={`font-black italic text-xl tracking-wider ${promo.text} drop-shadow-md text-center leading-none mb-1`}>
            {promo.title[language]}
        </h3>
        <p className="text-gray-300 text-[10px] font-mono uppercase tracking-widest text-center opacity-80 leading-tight max-w-[90%]">
            {promo.desc[language]}
        </p>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ onNavigate, onAuth, language, user, promos = [] }) => {
  const isGuest = !user || user.id === 'guest';

  const handleClick = () => {
    if (isGuest) {
      onAuth();
    } else {
      onNavigate(AppView.MENU);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden bg-[#0B0F19] pt-10 pb-20">
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* MAIN CENTER CONTENT */}
      <div 
        className="relative z-20 flex flex-col items-center justify-center cursor-pointer group mb-16"
        onClick={handleClick}
      >
        <div className="relative transform transition-transform duration-700 group-hover:scale-105">
          {/* Glow behind heart */}
          <div className="absolute inset-0 bg-red-500 blur-[60px] opacity-20 animate-pulse rounded-full"></div>
          
          {/* The Heart Icon */}
          <Heart 
            className="w-40 h-40 sm:w-64 sm:h-64 text-red-600 fill-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-[bounce_3s_infinite]" 
            strokeWidth={1}
          />
          
          {/* White shine on the heart */}
          <div className="absolute top-[20%] left-[20%] w-12 h-8 bg-white/30 blur-xl rounded-full skew-x-12"></div>
        </div>

        {/* Text Logo */}
        <h1 className="mt-8 text-5xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] text-center">
          Люблю<span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-pink-600 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]">Pizza</span>
        </h1>

        {/* Subtitle / CTA */}
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 hover:bg-white/10">
          {isGuest ? (
             <>
                <Fingerprint className="w-5 h-5 text-pink-500 animate-pulse" />
                <p className="text-pink-500 font-retro text-xs sm:text-sm tracking-[0.3em] animate-pulse uppercase">
                  {language === 'ru' ? 'ИНИЦИАЛИЗАЦИЯ ЛИЧНОСТИ' : 'INITIALIZE IDENTITY'}
                </p>
             </>
          ) : (
             <>
                <p className="text-green-400 font-retro text-xs sm:text-sm tracking-[0.3em] animate-pulse uppercase">
                    {language === 'ru' ? 'ДОСТУП РАЗРЕШЕН' : 'ACCESS GRANTED'}
                </p>
                <ArrowRight className="w-4 h-4 text-green-400" />
             </>
          )}
        </div>
      </div>

      {/* PROMO CARDS ROW (Zero Gravity) */}
      <div className="w-full max-w-7xl px-4 z-20">
         <div className="flex flex-wrap justify-center gap-6 md:gap-12 perspective-1000">
            {promos.map((promo) => (
                <FloatingCard key={promo.id} promo={promo} language={language} />
            ))}
         </div>
      </div>

      {/* CSS for floating animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default Hero;