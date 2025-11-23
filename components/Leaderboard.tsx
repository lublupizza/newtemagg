import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { Trophy, Timer, TrendingUp, User } from 'lucide-react';

interface LeaderboardProps {
  language: Language;
}

interface Player {
  rank: number;
  name: string;
  score: number;
  avatarColor: string;
  trend: 'up' | 'down' | 'same';
}

const MOCK_DATA: Player[] = [
  { rank: 1, name: "CyberKing_99", score: 45200, avatarColor: "bg-yellow-500", trend: 'same' },
  { rank: 2, name: "PizzaNinja", score: 38900, avatarColor: "bg-gray-300", trend: 'up' },
  { rank: 3, name: "NeonRider", score: 35400, avatarColor: "bg-orange-600", trend: 'up' },
  { rank: 4, name: "DoughMaster", score: 31000, avatarColor: "bg-blue-500", trend: 'down' },
  { rank: 5, name: "CheeseWizard", score: 28550, avatarColor: "bg-purple-500", trend: 'up' },
  { rank: 6, name: "CrustPunk", score: 25100, avatarColor: "bg-green-500", trend: 'same' },
  { rank: 7, name: "SalamiSam", score: 22400, avatarColor: "bg-red-500", trend: 'down' },
  { rank: 8, name: "OliveQueen", score: 19800, avatarColor: "bg-pink-500", trend: 'up' },
  { rank: 9, name: "SauceBoss", score: 18200, avatarColor: "bg-indigo-500", trend: 'same' },
  { rank: 10, name: "BasilBoy", score: 15600, avatarColor: "bg-teal-500", trend: 'down' },
];

// Custom High-Fidelity Cyber Heart Badge
const RankBadge = ({ rank, className }: { rank: number, className?: string }) => {
  
  const getTheme = (r: number) => {
    switch(r) {
      case 1: return { 
        // Burning Gold Theme
        gradMain: "url(#gradGoldMain)", 
        gradBevel: "url(#gradGoldBevel)", 
        stroke: "#FFF7CC",
        glowColor: "#FFD700",
        centerColor: "#FFF",
        filter: "url(#glowGold)"
      }; 
      case 2: return { 
        // Cyber Silver/Blue
        gradMain: "url(#gradSilverMain)", 
        gradBevel: "url(#gradSilverBevel)",
        stroke: "#E0F2FE",
        glowColor: "#38BDF8",
        centerColor: "#E0F2FE",
        filter: "url(#glowSilver)"
      };
      case 3: return { 
        // Deep Bronze
        gradMain: "url(#gradBronzeMain)", 
        gradBevel: "url(#gradBronzeBevel)",
        stroke: "#FDC4BD",
        glowColor: "#F43F5E",
        centerColor: "#FFEDD5",
        filter: "url(#glowBronze)"
      };
      default: return { 
        // Standard Amethyst
        gradMain: "url(#gradBaseMain)", 
        gradBevel: "url(#gradBaseBevel)",
        stroke: "#E9D5FF",
        glowColor: "#A855F7",
        centerColor: "#F3E8FF",
        filter: "none"
      };
    }
  };

  const theme = getTheme(rank);

  return (
    <svg viewBox="0 0 100 100" className={`${className} overflow-visible`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* --- 1. GOLD GRADIENTS --- */}
        <linearGradient id="gradGoldMain" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF500" /> {/* Bright Yellow */}
          <stop offset="40%" stopColor="#FFD700" /> {/* Gold */}
          <stop offset="80%" stopColor="#FF8C00" /> {/* Orange */}
          <stop offset="100%" stopColor="#B8860B" /> {/* Dark Gold */}
        </linearGradient>
        <linearGradient id="gradGoldBevel" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FDBA74" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#78350F" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glowGold" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feFlood floodColor="#FFD700" floodOpacity="0.8" result="glowColor" />
          <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow_colored" />
          <feMerge>
            <feMergeNode in="softGlow_colored"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* --- 2. SILVER GRADIENTS --- */}
        <linearGradient id="gradSilverMain" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="gradSilverBevel" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <filter id="glowSilver" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feFlood floodColor="#38BDF8" floodOpacity="0.6" result="glowColor" />
          <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow_colored" />
          <feMerge>
            <feMergeNode in="softGlow_colored"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* --- 3. BRONZE GRADIENTS --- */}
        <linearGradient id="gradBronzeMain" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
        <linearGradient id="gradBronzeBevel" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FECACA" />
          <stop offset="100%" stopColor="#450A0A" />
        </linearGradient>
        <filter id="glowBronze" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feFlood floodColor="#F43F5E" floodOpacity="0.5" result="glowColor" />
          <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow_colored" />
          <feMerge>
            <feMergeNode in="softGlow_colored"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

         {/* --- 4. BASE GRADIENTS --- */}
         <linearGradient id="gradBaseMain" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
         <linearGradient id="gradBaseBevel" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>

      </defs>
      
      {/* Outer Glow Group */}
      <g filter={theme.filter}>
          
          {/* 1. Back Plate (Darker to create depth) */}
          <path 
            d="M50 95 L15 55 C-5 35 5 10 30 10 C42 10 50 20 50 20 C50 20 58 10 70 10 C95 10 105 35 85 55 L50 95 Z" 
            fill="#000" 
            opacity="0.5"
            transform="translate(0, 3)"
          />

          {/* 2. Main Body (The Jewel) */}
          <path 
            d="M50 92 L18 54 C-1 34 8 12 32 12 C43 12 50 22 50 22 C50 22 57 12 68 12 C92 12 101 34 82 54 L50 92 Z" 
            fill={theme.gradMain} 
            stroke={theme.stroke}
            strokeWidth="2"
          />

          {/* 3. Faceted Shine (Top Bevel) */}
          <path 
            d="M50 25 C50 25 45 15 32 15 C18 15 12 30 22 45 L50 80 L78 45 C88 30 82 15 68 15 C55 15 50 25 50 25" 
            fill={theme.gradBevel} 
            style={{ mixBlendMode: 'overlay' }}
          />
          
          {/* 4. Central Crystal Core */}
          <path 
            d="M50 35 L60 45 L50 65 L40 45 Z" 
            fill={theme.centerColor}
            fillOpacity="0.9"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}
          />
          
          {/* 5. Rank Number */}
          <text 
            x="50" 
            y="50" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill={rank === 1 ? '#78350F' : '#1E293B'} 
            fontSize="14" 
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            style={{ textShadow: '0px 1px 0px rgba(255,255,255,0.5)' }}
          >
            {rank}
          </text>

          {/* 6. Sparkle for Rank 1 */}
          {rank === 1 && (
            <path 
                d="M50 5 L53 11 L60 12 L54 17 L55 24 L50 20 L45 24 L46 17 L40 12 L47 11 Z" 
                fill="white"
                className="animate-[spin_3s_linear_infinite]"
                style={{ transformOrigin: '50px 15px' }}
            />
          )}
      </g>
    </svg>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const t = {
    title: language === 'ru' ? 'ТОП 10 СЕЗОНА' : 'SEASON TOP 10',
    subtitle: language === 'ru' ? 'Сезон "Кибер-Зима" заканчивается через:' : 'Season "Cyber-Winter" ends in:',
    points: language === 'ru' ? 'Очков' : 'PTS',
    rank: language === 'ru' ? 'Ранг' : 'Rank'
  };

  const PodiumCard = ({ player, delay }: { player: Player, delay: number }) => (
    <div 
      className={`relative flex flex-col items-center p-4 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        background: player.rank === 1 
          ? 'linear-gradient(180deg, rgba(255, 215, 0, 0.2) 0%, rgba(0,0,0,0) 100%)' // GOLD Tint
          : player.rank === 2 
             ? 'linear-gradient(180deg, rgba(224, 242, 254, 0.15) 0%, rgba(0,0,0,0) 100%)' // SILVER Tint
             : 'linear-gradient(180deg, rgba(254, 202, 202, 0.15) 0%, rgba(0,0,0,0) 100%)', // BRONZE Tint
        height: player.rank === 1 ? '240px' : '190px',
        marginTop: player.rank === 1 ? '0' : '40px',
        borderTop: player.rank === 1 ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)'
      }}
    >
       {/* Rank Badge */}
       <div className="absolute -top-10 z-20">
          <RankBadge rank={player.rank} className={player.rank === 1 ? "w-24 h-24 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" : "w-20 h-20"} />
       </div>

       {/* Avatar */}
       <div className={`w-16 h-16 rounded-full ${player.avatarColor} border-2 border-white/20 shadow-xl flex items-center justify-center mb-3 mt-8 relative group z-10`}>
          <User className="w-8 h-8 text-white/90" />
          
          {/* Crown for #1 */}
          {player.rank === 1 && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</div>
          )}
       </div>

       {/* Info */}
       <div className="text-center z-10">
          <div className={`font-black italic text-white text-lg tracking-wider mb-1 ${player.rank === 1 ? 'text-yellow-300' : ''}`}>{player.name}</div>
          <div className="font-mono text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
             {player.score.toLocaleString()} {t.points}
          </div>
       </div>
       
       {/* Glow Effect for #1 */}
       {player.rank === 1 && (
         <div className="absolute inset-0 bg-yellow-500/20 blur-2xl -z-10 rounded-full animate-pulse"></div>
       )}
    </div>
  );

  const ListItem: React.FC<{ player: Player; index: number }> = ({ player, index }) => (
    <div 
       className={`flex items-center justify-between p-3 bg-gray-800/40 border-b border-gray-700/50 hover:bg-gray-800/80 transition-colors duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
       style={{ transitionDelay: `${600 + index * 100}ms` }}
    >
        <div className="flex items-center gap-4">
            <div className="font-mono text-gray-500 font-bold w-8 text-center flex justify-center">
                {index < 3 ? (
                     <RankBadge rank={player.rank} className="w-8 h-8" />
                ) : (
                    <span className="text-gray-600">#{player.rank}</span>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${player.avatarColor} flex items-center justify-center shadow-inner`}>
                    <span className="text-xs font-bold text-white">{player.name.charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-200">{player.name}</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center text-xs text-gray-500">
               {player.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500 mr-1" />}
               {player.trend === 'down' && <TrendingUp className="w-3 h-3 text-red-500 mr-1 rotate-180" />}
            </div>
            <div className="font-mono text-yellow-500 font-bold">{player.score.toLocaleString()}</div>
        </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-900/80 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative mb-8 ring-1 ring-white/5">
       {/* Animated Background Grid */}
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ 
           backgroundImage: 'linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)', 
           backgroundSize: '30px 30px' 
       }}></div>

       {/* Header */}
       <div className="relative z-10 p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-800 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
             <div className="p-2 bg-pink-600 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.6)]">
                <Trophy className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-2xl font-black italic text-white tracking-tighter neon-text">{t.title}</h3>
             </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-gray-700 shadow-inner">
             <Timer className="w-4 h-4 text-pink-500 animate-pulse" />
             <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.subtitle}</span>
             <span className="font-mono text-white font-bold">14d 08h 22m</span>
          </div>
       </div>

       {/* Content Grid */}
       <div className="relative z-10 p-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-end">
          
          {/* Left: The Podium (Top 3) */}
          <div className="lg:col-span-3 flex justify-center items-end gap-3 sm:gap-6 pb-4">
              <PodiumCard player={MOCK_DATA[1]} delay={200} /> {/* Silver */}
              <PodiumCard player={MOCK_DATA[0]} delay={0} />   {/* GOLD */}
              <PodiumCard player={MOCK_DATA[2]} delay={400} /> {/* Bronze */}
          </div>

          {/* Right: The List (4-10) */}
          <div className="lg:col-span-2 bg-black/40 rounded-2xl border border-gray-700/50 backdrop-blur-md overflow-hidden h-[280px] overflow-y-auto custom-scrollbar shadow-inner">
             {MOCK_DATA.slice(3).map((player, idx) => (
                 <ListItem key={player.rank} player={player} index={idx} />
             ))}
          </div>

       </div>
    </div>
  );
};

export default Leaderboard;