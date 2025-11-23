
import React, { useState } from 'react';
import { User, InventoryItem, Achievement, Language } from '../types';
import { Shield, Zap, Star, Share2, Hexagon, Activity, Clock, Award, Box, Sword, Bot, Ticket, Package, Edit3, Frame, LayoutTemplate, X, Check, Trophy, Gamepad2, ChefHat, PlayCircle, Info } from 'lucide-react';

interface UserProfileProps {
  user: User;
  inventory: InventoryItem[];
  language: Language;
  achievements: Achievement[];
}

// --- CONFIG ---
const FRAMES = [
    { id: 'default', name: 'Standard', rarity: 'common', color: 'border-gray-500' },
    { id: 'neon_blue', name: 'Cyber Blue', rarity: 'rare', color: 'border-cyan-400 shadow-[0_0_15px_cyan]' },
    { id: 'gold_leaf', name: 'Midas Touch', rarity: 'legendary', color: 'border-yellow-400 shadow-[0_0_25px_gold]' },
    { id: 'glitch_red', name: 'System Error', rarity: 'epic', color: 'border-red-500 shadow-[0_0_15px_red] animate-pulse' },
    { id: 'void_purple', name: 'Dark Matter', rarity: 'epic', color: 'border-purple-600 shadow-[0_0_20px_purple]' },
];

const MOCK_STATS = [
    { id: 'runner', name: { ru: 'Cyber Rush', en: 'Cyber Rush' }, score: 12500, plays: 42, icon: <Gamepad2 className="w-5 h-5 text-pink-400" /> },
    { id: 'snake', name: { ru: 'Змейка', en: 'Snake' }, score: 890, plays: 15, icon: <PlayCircle className="w-5 h-5 text-green-400" /> },
    { id: 'kitchen', name: { ru: 'Шеф Пицца', en: 'Chef Pizza' }, score: 2400, plays: 28, icon: <ChefHat className="w-5 h-5 text-orange-400" /> },
];

// --- HELPERS ---
const getLootIcon = (image: string, size: string = "w-8 h-8") => {
    if (image === 'dagger') return <Sword className={`${size} text-amber-400`} />;
    if (image === 'drone') return <Bot className={`${size} text-purple-400`} />;
    if (image === 'badge') return <Shield className={`${size} text-blue-400`} />;
    if (image === 'ticket') return <Ticket className={`${size} text-pink-400`} />;
    return <Package className={`${size} text-gray-400`} />;
};

// --- SUB-COMPONENTS ---

const AvatarFrameRender = ({ frameId, children }: { frameId: string, children: React.ReactNode }) => {
    const isGlitch = frameId === 'glitch_red';
    const isGold = frameId === 'gold_leaf';
    const isNeon = frameId === 'neon_blue';
    const isVoid = frameId === 'void_purple';

    return (
        <div className="relative inline-block">
            {/* Under-Glow */}
            <div className={`absolute inset-0 rounded-full blur-md transition-all duration-500 
                ${isNeon ? 'bg-cyan-500/50' : isGold ? 'bg-yellow-500/50' : isGlitch ? 'bg-red-500/50' : isVoid ? 'bg-purple-900/80' : 'bg-transparent'}
            `}></div>

            {/* Main Container */}
            <div className={`relative p-1 rounded-full z-10`}>
                
                {/* SVG Frame Overlay */}
                <svg className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                    {isNeon && <circle cx="50" cy="50" r="48" fill="none" stroke="cyan" strokeWidth="2" strokeDasharray="20 10" />}
                    {isGold && (
                        <>
                           <circle cx="50" cy="50" r="48" fill="none" stroke="#FCD34D" strokeWidth="3" />
                           <path d="M 50 2 L 52 8 L 50 10 Z" fill="gold" /> 
                        </>
                    )}
                    {isGlitch && <circle cx="50" cy="50" r="48" fill="none" stroke="red" strokeWidth="2" strokeDasharray="5 15 40 5" />}
                    {isVoid && <circle cx="50" cy="50" r="48" fill="none" stroke="#9333ea" strokeWidth="4" strokeOpacity="0.5" />}
                </svg>

                {/* Content (Avatar) */}
                <div className={`rounded-full overflow-hidden border-4 ${isNeon ? 'border-cyan-400' : isGold ? 'border-yellow-400' : isGlitch ? 'border-red-500' : isVoid ? 'border-purple-900' : 'border-gray-600'} relative z-10 bg-gray-900`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const HolographicCard = ({ user, frameId, onEdit, language, inventory }: { user: User, frameId: string, onEdit: () => void, language: Language, inventory: InventoryItem[] }) => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;

        setRotate({ x: -dy * 10, y: dx * 10 });
    };

    // Filter specific rare items to display
    const rareItems = inventory.filter(i => i.rarity !== 'common').slice(0, 5);

    return (
        <div 
            className="relative w-full aspect-[1.6/1] transition-transform duration-100 ease-out perspective-1000 group/card"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotate({ x: 0, y: 0 })}
            style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Holo Sheen */}
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_45%,transparent_50%)] opacity-50 pointer-events-none"></div>
                
                {/* Cyber Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-6">
                            
                            {/* AVATAR SECTION */}
                            <div className="relative group cursor-pointer" onClick={onEdit}>
                                <AvatarFrameRender frameId={frameId}>
                                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-4xl font-black text-white">{user.name.charAt(0)}</span>
                                    </div>
                                </AvatarFrameRender>
                                
                                {/* Edit Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <Edit3 className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded border border-yellow-500/30 uppercase tracking-widest">
                                        {user.rank.toUpperCase()}
                                    </div>
                                    <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded border border-blue-500/30 uppercase tracking-widest flex items-center gap-1">
                                        <Trophy className="w-3 h-3" /> RANK #42
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-white italic tracking-wider mt-1">{user.name}</h2>
                                <div className="text-gray-400 text-xs font-mono mt-1 opacity-70 mb-3">ID: {user.id.toUpperCase()}</div>
                                
                                {/* RARE BADGES DISPLAY ROW */}
                                {rareItems.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {rareItems.map((item) => (
                                            <div key={item.id} className="relative group/badge cursor-help">
                                                <div className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center border 
                                                    ${item.rarity === 'legendary' ? 'bg-amber-900/40 border-amber-500' : item.rarity === 'epic' ? 'bg-purple-900/40 border-purple-500' : 'bg-cyan-900/40 border-cyan-500'}
                                                `}>
                                                    {getLootIcon(item.image, "w-4 h-4")}
                                                </div>
                                                
                                                {/* DETAILED TOOLTIP */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/90 border border-white/20 rounded-xl p-3 backdrop-blur-xl shadow-2xl opacity-0 group-hover/badge:opacity-100 transition-opacity z-50 pointer-events-none">
                                                    <div className="text-xs font-bold text-white mb-1">{item.name[language]}</div>
                                                    <div className={`text-[10px] uppercase font-mono mb-2 ${item.rarity === 'legendary' ? 'text-amber-400' : item.rarity === 'epic' ? 'text-purple-400' : 'text-cyan-400'}`}>
                                                        {item.rarity}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 border-t border-white/10 pt-2 flex flex-col gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <Info className="w-3 h-3" /> 
                                                            <span>{language === 'ru' ? 'Источник:' : 'Source:'}</span>
                                                        </div>
                                                        <span className="text-white">{item.source?.[language] || (language === 'ru' ? 'Неизвестно' : 'Unknown')}</span>
                                                    </div>
                                                    <div className="text-[9px] text-gray-500 mt-1 text-right">{item.obtainedAt}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* "Patch" / Special Achievement */}
                        <div className="text-right flex flex-col items-end">
                            <Shield className="w-8 h-8 text-emerald-400 mb-1 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            <div className="text-[10px] text-emerald-400 font-bold font-mono uppercase">Verified Agent</div>
                        </div>
                    </div>

                    {/* Stats Bars */}
                    <div className="space-y-2 w-2/3">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <span>{language === 'ru' ? 'Опыт' : 'XP Progress'}</span>
                            <span>LVL 5</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-[58%] bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_purple]"></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">{language === 'ru' ? 'Баланс' : 'Balance'}</div>
                            <div className="text-3xl font-mono font-bold text-yellow-400 drop-shadow-md flex items-baseline gap-1">
                                {user.points.toLocaleString()} <span className="text-xs text-yellow-600">PTS</span>
                            </div>
                        </div>
                        {/* QR Preview */}
                        <div className="w-12 h-12 bg-white p-1 rounded-lg opacity-80">
                            <div className="w-full h-full bg-black flex flex-wrap content-start">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className={`w-1/4 h-1/4 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HexItem = ({ item, language }: { item: InventoryItem, language: Language }) => {
    const colorClass = item.rarity === 'legendary' ? 'text-amber-400 border-amber-500/50 bg-amber-900/20' :
                       item.rarity === 'epic' ? 'text-purple-400 border-purple-500/50 bg-purple-900/20' :
                       item.rarity === 'rare' ? 'text-blue-400 border-blue-500/50 bg-blue-900/20' :
                       'text-gray-400 border-gray-500/50 bg-gray-900/20';

    return (
        <div className="group relative w-24 h-28 flex items-center justify-center transition-transform hover:scale-110 hover:z-10">
            {/* Hexagon SVG Shape */}
            <div className={`absolute inset-0 opacity-80 transition-all group-hover:opacity-100 ${colorClass} clip-path-hexagon border-2`}>
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current opacity-20">
                    <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
                </svg>
            </div>
            <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full fill-none stroke-current stroke-2 ${colorClass.split(' ')[0]}`}>
                 <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
            </svg>
            <div className="relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                {getLootIcon(item.image)}
            </div>
            {/* Tooltip */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/90 border border-white/20 px-3 py-2 rounded-lg w-40 z-50 text-center">
                <div className="text-xs font-bold text-white mb-1">{item.name[language]}</div>
                <div className={`text-[10px] uppercase font-mono ${colorClass.split(' ')[0]}`}>{item.rarity}</div>
            </div>
        </div>
    );
};

const GameStatCard = ({ stat, language }: { stat: any, language: Language }) => (
    <div className="bg-gray-800/50 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-800 transition-colors">
        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center shadow-inner border border-white/5">
            {stat.icon}
        </div>
        <div className="flex-1">
            <div className="text-sm font-bold text-white">{stat.name[language]}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                {language === 'ru' ? 'Игр:' : 'Plays:'} {stat.plays}
            </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{language === 'ru' ? 'Лучший:' : 'Best:'}</div>
            <div className="text-lg font-mono font-bold text-yellow-400">{stat.score}</div>
        </div>
    </div>
);

const UserProfile: React.FC<UserProfileProps> = ({ user, inventory, language, achievements }) => {
  const [activeFrame, setActiveFrame] = useState('default');
  const [isEditing, setIsEditing] = useState(false);

  const t = {
    title: language === 'ru' ? 'ПРОФИЛЬ ИГРОКА' : 'PLAYER PROFILE',
    inventory: language === 'ru' ? 'ИНВЕНТАРЬ' : 'INVENTORY',
    achievements: language === 'ru' ? 'ДОСТИЖЕНИЯ' : 'ACHIEVEMENTS',
    gameStats: language === 'ru' ? 'СТАТИСТИКА ИГР' : 'GAME STATS',
    emptyInv: language === 'ru' ? 'Инвентарь пуст' : 'Inventory Empty',
    editTitle: language === 'ru' ? 'РЕДАКТОР АВАТАРА' : 'AVATAR EDITOR',
    frames: language === 'ru' ? 'РАМКИ' : 'FRAMES',
    apply: language === 'ru' ? 'ПРИМЕНИТЬ' : 'APPLY',
  };

  return (
    <div className="min-h-screen bg-black pt-8 pb-20 overflow-x-hidden">
       <div className="max-w-7xl mx-auto px-4">
           
           {/* HEADER */}
           <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
               <div>
                   <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 tracking-tighter neon-text animate-in slide-in-from-left-10 duration-700">
                       {t.title}
                   </h1>
                   <p className="text-gray-500 font-mono tracking-[0.5em] uppercase mt-2 animate-in fade-in delay-300">Welcome to the mainframe</p>
               </div>
               <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold text-white transition-colors">
                   <Share2 className="w-4 h-4" /> SHARE PROFILE
               </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               
               {/* LEFT COLUMN: CARD & STATS */}
               <div className="lg:col-span-5 space-y-8">
                   {/* MAIN CARD */}
                   <div className="animate-in zoom-in duration-700 delay-100">
                       <HolographicCard 
                          user={user} 
                          frameId={activeFrame} 
                          onEdit={() => setIsEditing(true)}
                          language={language}
                          inventory={inventory}
                       />
                   </div>

                   {/* GAME STATS */}
                   <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md animate-in slide-in-from-bottom-10 duration-700 delay-200">
                       <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                           <Activity className="w-5 h-5 text-pink-500" /> {t.gameStats}
                       </h3>
                       <div className="space-y-3">
                           {MOCK_STATS.map(stat => (
                               <GameStatCard key={stat.id} stat={stat} language={language} />
                           ))}
                       </div>
                   </div>
               </div>

               {/* RIGHT COLUMN: INVENTORY & ACHIEVEMENTS */}
               <div className="lg:col-span-7 space-y-8">
                   
                   {/* INVENTORY SECTION */}
                   <div className="animate-in slide-in-from-right-10 duration-700 delay-300">
                       <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                           <Hexagon className="w-6 h-6 text-cyan-400 fill-cyan-400/20" /> {t.inventory}
                           <span className="text-sm font-mono text-gray-500 font-normal ml-auto border border-gray-800 px-2 py-1 rounded">
                               {inventory.length} ITEMS
                           </span>
                       </h3>
                       
                       <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-8 min-h-[300px]">
                           {inventory.length > 0 ? (
                               <div className="flex flex-wrap gap-4">
                                   {inventory.map((item, i) => (
                                       <div key={item.id} className="animate-in zoom-in fill-mode-backwards" style={{ animationDelay: `${i * 100}ms` }}>
                                           <HexItem item={item} language={language} />
                                       </div>
                                   ))}
                                   {/* Empty Slots */}
                                   {Array.from({ length: Math.max(0, 8 - inventory.length) }).map((_, i) => (
                                       <div key={`empty-${i}`} className="w-24 h-28 opacity-10 border-2 border-white/20 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                                   ))}
                               </div>
                           ) : (
                               <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                                   <Box className="w-16 h-16 mb-4 opacity-20" />
                                   <p className="font-mono text-sm">{t.emptyInv}</p>
                               </div>
                           )}
                       </div>
                   </div>

                   {/* ACHIEVEMENTS SECTION */}
                   <div className="animate-in slide-in-from-bottom-10 duration-700 delay-500">
                       <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                           <Award className="w-6 h-6 text-yellow-400 fill-yellow-400/20" /> {t.achievements}
                       </h3>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {achievements.map((ach) => (
                               <div 
                                   key={ach.id} 
                                   className={`
                                       relative p-4 rounded-xl border flex items-center gap-4 overflow-hidden transition-all hover:scale-[1.02]
                                       ${ach.unlocked 
                                           ? 'bg-white/5 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                                           : 'bg-black/40 border-white/5 opacity-60 grayscale'}
                                   `}
                               >
                                   {ach.unlocked && (
                                       <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent pointer-events-none"></div>
                                   )}
                                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border ${ach.unlocked ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                                       {ach.icon}
                                   </div>
                                   <div>
                                       <h4 className={`font-bold ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>{ach.title[language]}</h4>
                                       <p className="text-[10px] text-gray-400 max-w-[200px]">{ach.desc[language]}</p>
                                       
                                       {/* Progress Bar */}
                                       <div className="mt-2 w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                           <div className="h-full bg-green-500" style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}></div>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

               </div>
           </div>

           {/* --- EDIT MODAL --- */}
           {isEditing && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                   <div className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                       <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                           <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                               <Frame className="text-pink-500" /> {t.editTitle}
                           </h3>
                           <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                               <X className="w-6 h-6 text-gray-400" />
                           </button>
                       </div>
                       
                       <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Preview */}
                           <div className="flex flex-col items-center justify-center bg-black/40 rounded-2xl p-8 border border-gray-800">
                                <AvatarFrameRender frameId={activeFrame}>
                                    <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-6xl font-black text-white">{user.name.charAt(0)}</span>
                                    </div>
                                </AvatarFrameRender>
                                <div className="mt-6 text-center">
                                    <div className="text-white font-bold text-lg">{user.name}</div>
                                    <div className="text-gray-500 text-sm uppercase">{FRAMES.find(f => f.id === activeFrame)?.name}</div>
                                </div>
                           </div>

                           {/* Selector */}
                           <div>
                               <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">{t.frames}</h4>
                               <div className="grid grid-cols-2 gap-3">
                                   {FRAMES.map(frame => (
                                       <button 
                                          key={frame.id}
                                          onClick={() => setActiveFrame(frame.id)}
                                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 group ${activeFrame === frame.id ? 'bg-white/10 border-white text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                       >
                                           <div className={`w-4 h-4 rounded-full ${frame.rarity === 'legendary' ? 'bg-yellow-400' : frame.rarity === 'epic' ? 'bg-purple-500' : frame.rarity === 'rare' ? 'bg-cyan-400' : 'bg-gray-500'}`}></div>
                                           <div>
                                               <div className="text-xs font-bold">{frame.name}</div>
                                               <div className="text-[8px] uppercase opacity-60">{frame.rarity}</div>
                                           </div>
                                           {activeFrame === frame.id && <Check className="w-4 h-4 ml-auto text-green-400" />}
                                       </button>
                                   ))}
                               </div>
                           </div>
                       </div>

                       <div className="p-6 border-t border-gray-800 flex justify-end">
                           <button 
                              onClick={() => setIsEditing(false)}
                              className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center gap-2"
                           >
                               <Check className="w-5 h-5" /> {t.apply}
                           </button>
                       </div>
                   </div>
               </div>
           )}

       </div>
    </div>
  );
};

export default UserProfile;
