
import React, { useState } from 'react';
import { AppView, User, Language } from '../types';
import { Sparkles, Gamepad2, Pizza, LayoutDashboard, User as UserIcon, Globe, ShoppingBag, Snowflake, BrainCircuit, Disc, ChevronDown, Puzzle, Trophy, Ticket, LogIn, Heart, X, Send } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  user: User;
  language: Language;
  onToggleLanguage: () => void;
  onOpenAuth: () => void;
}

const LOVE_QUOTES = [
  "Любовь — это когда ничего не стыдно, ничего не страшно, понимаете? Это когда тебя не подведут, не предадут.",
  "Любить — это не значит смотреть друг на друга, любить — значит вместе смотреть в одном направлении.",
  "Влюбиться можно в красоту, но полюбить — лишь только душу.",
  "Истинная любовь не знает преград, расстояний и времени.",
  "Любовь бежит от тех, кто гонится за нею, а тем, кто прочь бежит, кидается на шею."
];

const Header: React.FC<HeaderProps> = ({ currentView, onChangeView, user, language, onToggleLanguage, onOpenAuth }) => {
  const isGuest = user.id === 'guest';
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [secretQuote, setSecretQuote] = useState('');
  const [secretInput, setSecretInput] = useState('');
  const [secretFeedback, setSecretFeedback] = useState('');
  
  // MOBILE FIX: Toggle state for games dropdown
  const [isGamesOpen, setIsGamesOpen] = useState(false);

  const handleSecretClick = () => {
    if (!isSecretOpen) {
        const random = LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)];
        setSecretQuote(random);
        setSecretInput('');
        setSecretFeedback('');
    }
    setIsSecretOpen(!isSecretOpen);
  };

  const handleSecretSubmit = () => {
      if (!secretInput.trim()) return;

      const val = secretInput.toLowerCase().trim();
      if (val === 'далдалдома') {
          setIsSecretOpen(false);
          onChangeView(AppView.ADMIN);
      } else {
          setSecretFeedback('Это здорово!');
          setTimeout(() => {
              setSecretFeedback('');
              setSecretInput('');
          }, 2000);
      }
  };

  const labels = {
    games: language === 'ru' ? 'Игры' : 'Games',
    arcade: language === 'ru' ? 'Аркады' : 'Arcade',
    quiz: language === 'ru' ? 'Викторина' : 'Quiz',
    wheel: language === 'ru' ? 'Колесо Фортуны' : 'Lucky Wheel',
    puzzle: language === 'ru' ? 'Пазлы' : 'Cyber Puzzle',
    scratch: language === 'ru' ? 'Счастливая Карта' : 'Lucky Card',
    seasonal: language === 'ru' ? 'Событие' : 'Event',
    menu: language === 'ru' ? 'Меню' : 'Menu',
    shop: language === 'ru' ? 'Магазин Наград' : 'Rewards Shop',
    rankings: language === 'ru' ? 'Рейтинг' : 'Rankings',
    level: language === 'ru' ? 'Ур' : 'Lvl',
    login: language === 'ru' ? 'ВОЙТИ' : 'LOGIN',
    guest: language === 'ru' ? 'ГОСТЬ' : 'GUEST',
  };

  return (
    <header className="sticky top-0 z-[100] bg-gray-900/95 backdrop-blur-md border-b border-pink-600 shadow-lg shadow-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => onChangeView(AppView.HOME)}
          >
            <div className="relative">
              <Pizza className="h-8 w-8 text-yellow-400 group-hover:rotate-12 transition-transform" />
              <Heart className="absolute -top-1 -right-1 h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
            </div>
            <span className="ml-2 text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
              Люблю<span className="text-white">Pizza</span>Club
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-2 lg:space-x-6">
            
            {/* GAMES DROPDOWN - FIXED FOR TOUCH */}
            <div 
              className="relative group"
              onMouseLeave={() => setIsGamesOpen(false)} // Close on mouse leave for desktop
            >
              <button
                onClick={() => setIsGamesOpen(!isGamesOpen)} // Toggle on click for mobile/tablet
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  [AppView.GAMES, AppView.QUIZ, AppView.WHEEL, AppView.PUZZLE, AppView.SCRATCH].includes(currentView)
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-purple-400'
                    : 'text-white hover:bg-gradient-to-r hover:from-purple-900 hover:to-pink-900 hover:shadow-lg border border-transparent hover:border-purple-500/30'
                }`}
              >
                <Gamepad2 className="w-4 h-4 mr-2 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(192,38,211,0.8)]" />
                {labels.games}
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isGamesOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute left-0 top-full pt-2 w-64 transition-all duration-200 transform z-[100] ${isGamesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
                <div className="bg-gray-900 border border-purple-500/50 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden">
                   <button 
                      onClick={() => { onChangeView(AppView.GAMES); setIsGamesOpen(false); }}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors text-left group/item border-b border-gray-800"
                   >
                      <div className="p-2 bg-pink-500/20 rounded-lg mr-3 group-hover/item:bg-pink-500 transition-colors shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                        <Gamepad2 className="w-4 h-4 text-pink-400 group-hover/item:text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{labels.arcade}</div>
                        <div className="text-[10px] text-gray-400">Cyber Rush & Snake</div>
                      </div>
                   </button>
                   
                   <button 
                      onClick={() => { onChangeView(AppView.QUIZ); setIsGamesOpen(false); }}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors text-left group/item border-b border-gray-800"
                   >
                      <div className="p-2 bg-purple-500/20 rounded-lg mr-3 group-hover/item:bg-purple-500 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                        <BrainCircuit className="w-4 h-4 text-purple-400 group-hover/item:text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{labels.quiz}</div>
                        <div className="text-[10px] text-gray-400">Win Points</div>
                      </div>
                   </button>

                   <button 
                      onClick={() => { onChangeView(AppView.PUZZLE); setIsGamesOpen(false); }}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors text-left group/item border-b border-gray-800"
                   >
                      <div className="p-2 bg-blue-500/20 rounded-lg mr-3 group-hover/item:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        <Puzzle className="w-4 h-4 text-blue-400 group-hover/item:text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{labels.puzzle}</div>
                        <div className="text-[10px] text-gray-400">Swap & Solve</div>
                      </div>
                   </button>
                   
                   <button 
                      onClick={() => { onChangeView(AppView.SCRATCH); setIsGamesOpen(false); }}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors text-left group/item border-b border-gray-800"
                   >
                      <div className="p-2 bg-green-500/20 rounded-lg mr-3 group-hover/item:bg-green-500 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                        <Ticket className="w-4 h-4 text-green-400 group-hover/item:text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{labels.scratch}</div>
                        <div className="text-[10px] text-gray-400">Reveal Prizes</div>
                      </div>
                   </button>

                   <button 
                      onClick={() => { onChangeView(AppView.WHEEL); setIsGamesOpen(false); }}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors text-left group/item"
                   >
                      <div className="p-2 bg-yellow-500/20 rounded-lg mr-3 group-hover/item:bg-yellow-500 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                        <Disc className="w-4 h-4 text-yellow-400 group-hover/item:text-white animate-spin-slow" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{labels.wheel}</div>
                        <div className="text-[10px] text-gray-400">Daily Prizes</div>
                      </div>
                   </button>
                </div>
              </div>
            </div>

            {/* Seasonal */}
            <button
                onClick={() => onChangeView(AppView.SEASONAL)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  currentView === AppView.SEASONAL
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                    : 'text-blue-300 hover:text-white hover:bg-blue-900/50 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                }`}
            >
                <Snowflake className={`w-4 h-4 mr-2 animate-pulse`} />
                {labels.seasonal}
            </button>

            {/* MENU */}
            <button
                onClick={() => onChangeView(AppView.MENU)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 group ${
                  currentView === AppView.MENU
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] ring-2 ring-yellow-400'
                    : 'bg-gradient-to-r from-orange-600/80 to-red-700/80 text-white hover:from-orange-500 hover:to-red-600 shadow-[0_0_15px_rgba(234,88,12,0.4)] border border-orange-400/30'
                }`}
            >
                <Pizza className={`w-4 h-4 mr-2 ${currentView === AppView.MENU ? 'animate-spin-slow' : 'group-hover:rotate-12 transition-transform'}`} />
                {labels.menu}
            </button>

            {/* Shop */}
            <button
               onClick={() => onChangeView(AppView.SHOP)}
               className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                 currentView === AppView.SHOP
                   ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                   : 'text-gray-300 hover:text-white hover:bg-gray-800'
               }`}
            >
               <ShoppingBag className="w-4 h-4 mr-2" />
               {labels.shop}
            </button>

            {/* Rankings */}
            <button
               onClick={() => onChangeView(AppView.RANKINGS)}
               className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                 currentView === AppView.RANKINGS
                   ? 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                   : 'text-gray-300 hover:text-white hover:bg-gray-800'
               }`}
            >
               <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
               {labels.rankings}
            </button>

          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            
            {/* Language */}
            <button 
              onClick={onToggleLanguage}
              className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-bold transition-colors border border-gray-700"
            >
              <Globe className="w-3 h-3" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* User Profile / Login */}
            {isGuest ? (
                <button 
                  onClick={onOpenAuth}
                  className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105"
                >
                   <LogIn className="w-4 h-4" /> {labels.login}
                </button>
            ) : (
                <button 
                  onClick={() => onChangeView(AppView.PROFILE)}
                  className={`hidden sm:flex flex-col items-end group cursor-pointer p-2 rounded-lg transition-colors ${currentView === AppView.PROFILE ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{labels.level} 5 • {user.rank}</span>
                  <span className="text-sm font-bold text-yellow-400 font-mono group-hover:scale-105 transition-transform">{user.points} PTS</span>
                </button>
            )}

            <div className="h-8 w-[1px] bg-gray-700 mx-2 hidden sm:block"></div>
            
            {/* SECRET HEART (Admin Access) */}
            <div className="relative">
                <button
                  onClick={handleSecretClick}
                  className={`p-2 rounded-full transition-colors hover:bg-gray-800 ${isSecretOpen ? 'text-red-500' : 'text-gray-600'}`}
                >
                  <Heart className={`w-5 h-5 ${isSecretOpen ? 'fill-current animate-pulse' : ''}`} />
                </button>

                {isSecretOpen && (
                    <div className="absolute right-0 top-full mt-4 w-72 bg-black/90 border border-red-500/30 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.3)] backdrop-blur-xl p-6 z-[100] animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                            <button onClick={() => setIsSecretOpen(false)} className="text-gray-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-white text-sm italic font-serif leading-relaxed border-l-2 border-red-500 pl-3 opacity-90">
                                "{secretQuote}"
                            </p>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 block">А что для тебя любовь?</label>
                            <textarea 
                                value={secretInput}
                                onChange={(e) => setSecretInput(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-red-500 outline-none resize-none h-20 transition-colors placeholder-gray-600 mb-3"
                                placeholder="..."
                            />
                            
                            {secretFeedback ? (
                                <div className="w-full py-2 bg-green-500/20 text-green-400 text-center text-sm font-bold rounded-lg animate-pulse border border-green-500/50">
                                    {secretFeedback}
                                </div>
                            ) : (
                                <button 
                                    onClick={handleSecretSubmit}
                                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-3 h-3" /> ОТВЕТИТЬ
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

          </div>
        </div>
      </div>
      
      {/* Mobile Nav Bar */}
      <div className="md:hidden flex justify-around bg-gray-900 border-t border-gray-800 py-2">
          {[
              { id: AppView.HOME, icon: UserIcon },
              { id: AppView.GAMES, icon: Gamepad2 },
              { id: AppView.SEASONAL, icon: Snowflake },
              { id: AppView.MENU, icon: Pizza }, 
              { id: AppView.SHOP, icon: ShoppingBag },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`p-2 rounded-lg ${
                    currentView === item.id 
                    ? item.id === AppView.MENU ? 'text-orange-500 bg-orange-500/10' : 'text-pink-500' 
                    : 'text-gray-500'
                }`}
              >
                <item.icon className={`w-6 h-6 ${item.id === AppView.SEASONAL ? 'text-blue-400' : ''}`} />
              </button>
            ))}
      </div>
    </header>
  );
};

export default Header;
