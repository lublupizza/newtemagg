
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Trophy, Crown, TrendingUp, Search, Gamepad2, Gem, Globe, Timer, Shield, Zap, Star, LayoutGrid, Ghost } from 'lucide-react';

interface GlobalRankingsProps {
  language: Language;
}

interface RankUser {
  id: string;
  rank: number;
  name: string;
  score: number;
  avatarColor: string;
  category: 'gamer' | 'collector'; // Simplified categories
  trend: 'up' | 'down' | 'same';
  achievements: number;
}

const MOCK_RANKINGS: RankUser[] = [
  { id: '1', rank: 1, name: "CyberKing_99", score: 154200, avatarColor: "bg-gradient-to-br from-yellow-400 to-orange-500", category: 'gamer', trend: 'same', achievements: 45 },
  { id: '2', rank: 2, name: "PizzaNinja", score: 138900, avatarColor: "bg-gradient-to-br from-gray-300 to-gray-500", category: 'gamer', trend: 'up', achievements: 38 },
  { id: '3', rank: 3, name: "GemMaster", score: 135400, avatarColor: "bg-gradient-to-br from-amber-400 to-yellow-200", category: 'collector', trend: 'up', achievements: 41 },
  { id: '4', rank: 4, name: "CryptoCrust", score: 98000, avatarColor: "bg-blue-500", category: 'collector', trend: 'down', achievements: 22 },
  { id: '5', rank: 5, name: "CollectorX", score: 88550, avatarColor: "bg-purple-500", category: 'collector', trend: 'up', achievements: 55 },
  { id: '6', rank: 6, name: "SpeedDemon", score: 85100, avatarColor: "bg-green-500", category: 'gamer', trend: 'same', achievements: 30 },
  { id: '7', rank: 7, name: "SalamiSam", score: 72400, avatarColor: "bg-red-500", category: 'collector', trend: 'down', achievements: 15 },
  { id: '8', rank: 8, name: "OliveQueen", score: 69800, avatarColor: "bg-pink-500", category: 'collector', trend: 'up', achievements: 42 },
  { id: '9', rank: 9, name: "SauceBoss", score: 58200, avatarColor: "bg-indigo-500", category: 'gamer', trend: 'same', achievements: 28 },
  { id: '10', rank: 10, name: "BasilBoy", score: 45600, avatarColor: "bg-teal-500", category: 'gamer', trend: 'down', achievements: 10 },
];

// --- SVG BADGES (Reusable) ---
const RankBadge = ({ rank, className }: { rank: number, className?: string }) => {
  const getTheme = (r: number) => {
    switch(r) {
      case 1: return { 
        gradMain: "url(#gradGoldMain)", gradBevel: "url(#gradGoldBevel)", stroke: "#FFF7CC", glowColor: "#FFD700", centerColor: "#FFF", filter: "url(#glowGold)"
      }; 
      case 2: return { 
        gradMain: "url(#gradSilverMain)", gradBevel: "url(#gradSilverBevel)", stroke: "#E0F2FE", glowColor: "#38BDF8", centerColor: "#E0F2FE", filter: "url(#glowSilver)"
      };
      case 3: return { 
        gradMain: "url(#gradBronzeMain)", gradBevel: "url(#gradBronzeBevel)", stroke: "#FDC4BD", glowColor: "#F43F5E", centerColor: "#FFEDD5", filter: "url(#glowBronze)"
      };
      default: return { 
        gradMain: "url(#gradBaseMain)", gradBevel: "url(#gradBaseBevel)", stroke: "#E9D5FF", glowColor: "#A855F7", centerColor: "#F3E8FF", filter: "none"
      };
    }
  };
  const theme = getTheme(rank);
  return (
    <svg viewBox="0 0 100 100" className={`${className} overflow-visible`} fill="none">
      <defs>
        <linearGradient id="gradGoldMain" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#FFF500"/><stop offset="40%" stopColor="#FFD700"/><stop offset="100%" stopColor="#B8860B"/></linearGradient>
        <linearGradient id="gradSilverMain" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#FFF"/><stop offset="100%" stopColor="#475569"/></linearGradient>
        <linearGradient id="gradBronzeMain" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#FCA5A5"/><stop offset="100%" stopColor="#7F1D1D"/></linearGradient>
        <filter id="glowGold"><feGaussianBlur stdDeviation="4" result="blur"/><feFlood floodColor="#FFD700" floodOpacity="0.5"/><feComposite in2="blur" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g filter={theme.filter}>
          <path d="M50 92 L18 54 C-1 34 8 12 32 12 C43 12 50 22 50 22 C50 22 57 12 68 12 C92 12 101 34 82 54 L50 92 Z" fill={theme.gradMain} stroke={theme.stroke} strokeWidth="2"/>
          <path d="M50 25 C50 25 45 15 32 15 C18 15 12 30 22 45 L50 80 L78 45 C88 30 82 15 68 15 C55 15 50 25 50 25" fill="white" fillOpacity="0.3" style={{ mixBlendMode: 'overlay' }}/>
          <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fill="#000" fontSize="14" fontWeight="900">{rank}</text>
      </g>
    </svg>
  );
};

// --- PODIUM PLAYER COMPONENT ---
const PodiumPlayer = ({ user, place, t, themeColor }: { user: RankUser, place: number, t: any, themeColor: string }) => {
    const isFirst = place === 1;
    const isSecond = place === 2;
    
    // Dynamic Styles based on Rank
    const heightClass = isFirst ? 'h-[380px]' : isSecond ? 'h-[320px]' : 'h-[280px]';
    const delay = isFirst ? 'delay-200' : isSecond ? 'delay-0' : 'delay-100';
    
    // Color Mapping based on Theme (Gamer vs Collector vs All)
    let accentColor = 'from-yellow-600/40 to-yellow-900/60'; // Default Gold
    if (themeColor === 'gamer') accentColor = isFirst ? 'from-pink-600/40 to-pink-900/60' : 'from-purple-600/30 to-purple-900/50';
    if (themeColor === 'collector') accentColor = isFirst ? 'from-amber-500/40 to-amber-800/60' : 'from-yellow-600/30 to-yellow-900/50';

    const borderColor = isFirst ? 'border-white/50' : 'border-white/20';
    const glow = isFirst ? `shadow-[0_0_60px_${themeColor === 'gamer' ? 'rgba(236,72,153,0.4)' : 'rgba(234,179,8,0.3)'}]` : '';

    return (
        <div className={`relative flex flex-col items-center justify-end group z-10 ${place === 1 ? 'order-2 -mt-12 z-20' : place === 2 ? 'order-1' : 'order-3'}`}>
            
            {/* Floating Avatar */}
            <div className={`relative mb-4 animate-[float_3s_ease-in-out_infinite] ${delay}`}>
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl rotate-45 border-4 ${borderColor} ${user.avatarColor} shadow-2xl flex items-center justify-center overflow-hidden transform transition-transform group-hover:scale-110 group-hover:rotate-[50deg]`}>
                    <div className="-rotate-45 flex items-center justify-center w-full h-full">
                        <span className="text-4xl font-black text-white drop-shadow-md">{user.name.charAt(0)}</span>
                    </div>
                </div>
                {/* Rank Badge Overlay */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <RankBadge rank={place} className="w-16 h-16 drop-shadow-lg" />
                </div>
                {/* Crown for #1 */}
                {isFirst && (
                    <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                )}
            </div>

            {/* The Pedestal */}
            <div className={`
                w-full min-w-[110px] md:min-w-[160px] ${heightClass} rounded-t-[30px] 
                bg-gradient-to-b ${accentColor} border-t border-x ${borderColor} backdrop-blur-xl 
                flex flex-col items-center pt-12 pb-4 px-2 text-center transition-all duration-500
                ${glow} hover:bg-opacity-80
                animate-in slide-in-from-bottom-20 fade-in duration-1000 fill-mode-backwards ${delay}
            `}>
                {/* Player Info */}
                <h3 className={`text-lg md:text-xl font-black text-white truncate w-full px-2 ${isFirst ? 'text-yellow-200' : ''}`}>
                    {user.name}
                </h3>
                
                <div className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/60 font-mono">
                    {t.categories[user.category]}
                </div>

                <div className="mt-auto mb-4 w-full">
                     <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{t.points}</div>
                     <div className={`text-2xl md:text-3xl font-black font-mono ${isFirst ? 'text-yellow-400' : 'text-white'}`}>
                         {user.score.toLocaleString()}
                     </div>
                </div>

                {/* Bottom Highlight */}
                <div className={`w-1/2 h-1 rounded-full ${isFirst ? 'bg-white' : 'bg-white/50'} opacity-50`}></div>
            </div>
        </div>
    );
}

const GlobalRankings: React.FC<GlobalRankingsProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gamer' | 'collector'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    title: language === 'ru' ? 'ТОП 10 СЕЗОНА' : 'SEASON TOP 10',
    subtitle: language === 'ru' ? 'Зал Славы "Кибер-Зима"' : 'Hall of Fame "Cyber-Winter"',
    seasonEnd: language === 'ru' ? 'Конец сезона:' : 'Season Ends:',
    tabs: {
      all: language === 'ru' ? 'Общий' : 'Overall',
      gamer: language === 'ru' ? 'Геймеры' : 'Gamers',
      collector: language === 'ru' ? 'Коллекционеры' : 'Collectors',
    },
    search: language === 'ru' ? 'Поиск...' : 'Search...',
    points: language === 'ru' ? 'PTS' : 'PTS',
    categories: {
        gamer: language === 'ru' ? 'Геймер' : 'Gamer',
        collector: language === 'ru' ? 'Коллекционер' : 'Collector',
    },
    headers: {
        rank: language === 'ru' ? 'РАНГ' : 'RANK',
        player: language === 'ru' ? 'ИГРОК' : 'PLAYER',
        stats: language === 'ru' ? 'СТАТИСТИКА' : 'STATS',
        score: language === 'ru' ? 'СЧЕТ' : 'SCORE'
    }
  };

  const filteredData = MOCK_RANKINGS
    .filter(u => activeTab === 'all' || u.category === activeTab)
    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const top3 = filteredData.slice(0, 3);
  const rest = filteredData.slice(3);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden pb-20 relative">
      
      {/* DYNAMIC AMBIENT BACKGROUNDS BASED ON TAB */}
      <div className="fixed inset-0 pointer-events-none transition-colors duration-1000">
         
         {/* 1. OVERALL / DEFAULT: Deep Blue/Purple */}
         {activeTab === 'all' && (
            <>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-purple-900/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[150px]"></div>
                <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-purple-500/5 animate-[spin_20s_linear_infinite]" />
            </>
         )}

         {/* 2. GAMER: Neon Pink/Cyan with JOYSTICK */}
         {activeTab === 'gamer' && (
            <>
                <div className="absolute top-0 right-0 w-[1000px] h-[800px] bg-pink-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
                {/* Giant Joystick Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 animate-[pulse_4s_infinite]">
                    <Gamepad2 className="w-[800px] h-[800px] text-pink-500 rotate-12" />
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            </>
         )}

         {/* 3. COLLECTOR: Gold/Amber with DIAMOND */}
         {activeTab === 'collector' && (
            <>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-amber-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 w-full h-[400px] bg-gradient-to-t from-yellow-900/20 to-transparent"></div>
                {/* Giant Gem Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                    <Gem className="w-[800px] h-[800px] text-yellow-400 -rotate-12 animate-[float_6s_ease-in-out_infinite]" />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_70%)]"></div>
            </>
         )}

      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 pt-8">
        
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <Timer className="w-3 h-3 text-pink-500" /> {t.seasonEnd} <span className="text-white">14d 12h</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-in zoom-in duration-700">
               {t.title}
            </h1>
            <p className="text-purple-300/70 font-mono tracking-[0.4em] uppercase text-sm mb-10 animate-in fade-in delay-200 duration-700">{t.subtitle}</p>

            {/* Controls Bar */}
            <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-4 p-2 bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700">
                <div className="flex gap-1 bg-black/20 p-1 rounded-xl w-full md:w-auto">
                   {[
                     { id: 'all', label: t.tabs.all, icon: LayoutGrid },
                     { id: 'gamer', label: t.tabs.gamer, icon: Gamepad2 },
                     { id: 'collector', label: t.tabs.collector, icon: Gem },
                   ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                         activeTab === tab.id 
                         ? tab.id === 'gamer' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/40' 
                         : tab.id === 'collector' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40'
                         : 'bg-gray-700 text-white shadow-lg'
                         : 'text-gray-400 hover:text-white hover:bg-white/5'
                       }`}
                     >
                       <tab.icon className="w-3 h-3" /> {tab.label}
                     </button>
                   ))}
                </div>
                <div className="relative w-full">
                   <Search className="absolute left-3 top-1/2 -translate-x-0 -translate-y-1/2 text-gray-500 w-4 h-4" />
                   <input 
                     type="text" 
                     placeholder={t.search}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder-gray-600"
                   />
                </div>
            </div>
        </div>

        {/* UNIFIED PODIUM STAGE */}
        <div className="relative w-full max-w-4xl mx-auto mb-12 min-h-[400px] flex justify-center items-end px-4 pb-10">
            {/* Floor Glow */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[100px] blur-[60px] rounded-[100%] pointer-events-none transition-colors duration-700
                ${activeTab === 'gamer' ? 'bg-pink-600/30' : activeTab === 'collector' ? 'bg-amber-500/30' : 'bg-purple-600/20'}
            `}></div>
            
            {/* Stage Container */}
            <div className="flex items-end justify-center gap-2 md:gap-6 w-full">
                {top3[1] && <PodiumPlayer user={top3[1]} place={2} t={t} themeColor={activeTab} />}
                {top3[0] && <PodiumPlayer user={top3[0]} place={1} t={t} themeColor={activeTab} />}
                {top3[2] && <PodiumPlayer user={top3[2]} place={3} t={t} themeColor={activeTab} />}
            </div>
        </div>

        {/* RANK LIST */}
        <div className="max-w-4xl mx-auto">
           <div className={`bg-gray-900/40 border rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl transition-colors duration-500
                ${activeTab === 'gamer' ? 'border-pink-500/20' : activeTab === 'collector' ? 'border-amber-500/20' : 'border-white/5'}
           `}>
               {/* List Header */}
               <div className="grid grid-cols-12 px-6 py-4 bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <div className="col-span-2 text-center">{t.headers.rank}</div>
                  <div className="col-span-5">{t.headers.player}</div>
                  <div className="col-span-3 text-center hidden md:block">{t.headers.stats}</div>
                  <div className="col-span-5 md:col-span-2 text-right">{t.headers.score}</div>
               </div>
               
               {/* Rows */}
               <div className="divide-y divide-white/5">
                   {rest.map((user, idx) => (
                       <div 
                         key={user.id}
                         className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/5 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                         style={{ animationDelay: `${500 + idx * 50}ms` }}
                       >
                           <div className="col-span-2 flex justify-center">
                               <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center font-mono font-bold text-gray-400 group-hover:text-white group-hover:bg-gray-700 transition-colors">
                                   {user.rank}
                               </div>
                           </div>
                           
                           <div className="col-span-5 flex items-center gap-3">
                               <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center border-2 border-white/10 shadow-md`}>
                                   <span className="font-bold text-white text-xs">{user.name[0]}</span>
                               </div>
                               <div className="flex flex-col">
                                   <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{user.name}</span>
                                   <span className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                       <span className={`w-2 h-2 rounded-full ${user.category === 'gamer' ? 'bg-pink-500' : 'bg-amber-500'}`}></span>
                                       {t.categories[user.category]}
                                   </span>
                               </div>
                           </div>

                           <div className="col-span-3 hidden md:flex justify-center items-center gap-4 text-gray-500">
                               <div className="flex items-center gap-1" title="Achievements">
                                   <Trophy className="w-3 h-3" /> <span className="text-xs font-mono">{user.achievements}</span>
                               </div>
                               <div className="flex items-center gap-1" title="Trend">
                                   {user.trend === 'up' ? <TrendingUp className="w-3 h-3 text-green-500" /> : 
                                    user.trend === 'down' ? <TrendingUp className="w-3 h-3 text-red-500 rotate-180" /> : 
                                    <div className="w-3 h-1 bg-gray-600 rounded-full"></div>}
                               </div>
                           </div>

                           <div className="col-span-5 md:col-span-2 text-right">
                               <span className={`font-mono font-black text-lg transition-colors block
                                   ${activeTab === 'gamer' ? 'text-gray-300 group-hover:text-pink-400' : activeTab === 'collector' ? 'text-gray-300 group-hover:text-amber-400' : 'text-gray-300 group-hover:text-white'}
                               `}>
                                   {user.score.toLocaleString()}
                               </span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalRankings;
