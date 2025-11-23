
import React from 'react';
import { Lock, Construction, Clock } from 'lucide-react';
import { Language } from '../types';

interface DisabledGameScreenProps {
  title: string;
  language: Language;
}

const DisabledGameScreen: React.FC<DisabledGameScreenProps> = ({ title, language }) => {
  const t = {
    soon: language === 'ru' ? 'СКОРО' : 'COMING SOON',
    desc: language === 'ru' ? 'Эта игра временно недоступна или находится в разработке.' : 'This game is temporarily unavailable or under development.',
    back: language === 'ru' ? 'Мы работаем над этим!' : 'We are working on it!'
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black overflow-hidden rounded-3xl border-4 border-gray-800">
      {/* Blurred Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-gray-800/50 rounded-full border-4 border-gray-700 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
            <Lock className="w-10 h-10 text-gray-400" />
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-2 animate-bounce">
                <Clock className="w-4 h-4" />
            </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-4 tracking-tighter">
            {title}
        </h2>

        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Construction className="w-3 h-3" /> {t.soon}
        </div>

        <p className="text-gray-500 font-mono text-sm max-w-md leading-relaxed">
            {t.desc}
            <br/>
            <span className="text-gray-400 mt-2 block">{t.back}</span>
        </p>
      </div>
    </div>
  );
};

export default DisabledGameScreen;
