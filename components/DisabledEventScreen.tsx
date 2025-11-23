
import React from 'react';
import { Calendar, Snowflake, Bell } from 'lucide-react';
import { Language } from '../types';

interface DisabledEventScreenProps {
  language: Language;
}

const DisabledEventScreen: React.FC<DisabledEventScreenProps> = ({ language }) => {
  const t = {
    title: language === 'ru' ? 'СОБЫТИЕ НЕДОСТУПНО' : 'EVENT UNAVAILABLE',
    status: language === 'ru' ? 'ОФФЛАЙН' : 'OFFLINE',
    desc: language === 'ru' 
        ? 'Событие еще не началось или уже закончилось.' 
        : 'The event has not started yet or has already ended.',
    follow: language === 'ru' 
        ? 'Следи за новостями!' 
        : 'Follow the news!',
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center bg-black overflow-hidden rounded-3xl border-4 border-blue-900/50 relative">
      
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e3a8a_0%,#000_70%)] opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-10"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center p-8 animate-in zoom-in duration-500">
        
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
            <div className="w-28 h-28 bg-gray-900 rounded-full border-4 border-blue-500/50 flex items-center justify-center shadow-2xl">
                <Calendar className="w-12 h-12 text-blue-400" />
                <div className="absolute -bottom-2 -right-2 bg-gray-800 p-2 rounded-full border border-gray-700">
                    <Snowflake className="w-6 h-6 text-white animate-spin-slow" />
                </div>
            </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-6">
             <div className="w-2 h-2 bg-gray-500 rounded-full"></div> {t.status}
        </div>

        <h2 className="text-4xl md:text-5xl font-black italic text-white mb-4 tracking-tighter drop-shadow-lg">
            {t.title}
        </h2>

        <p className="text-gray-400 font-mono text-sm md:text-base max-w-md leading-relaxed mb-8">
            {t.desc}
        </p>

        <div className="bg-gray-800/50 border border-white/10 p-4 rounded-xl flex items-center gap-3 text-sm text-gray-300">
            <Bell className="w-5 h-5 text-yellow-400 animate-bounce" />
            <span className="font-bold tracking-wide">{t.follow}</span>
        </div>

      </div>
    </div>
  );
};

export default DisabledEventScreen;
