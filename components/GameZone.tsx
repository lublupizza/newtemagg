
import React, { useState } from 'react';
import { Trophy, Gamepad2, PlayCircle, ChefHat, Grid3X3, ArrowUpCircle, Info, Keyboard, MousePointer, Hand, Rocket, Box, Flag } from 'lucide-react';
import { Language, GamesConfig, GameId } from '../types';
import PizzaRunner from './PizzaRunner';
import PizzaSnake from './PizzaSnake';
import PizzaStacker from './PizzaStacker';
import PizzaKitchen from './PizzaKitchen';
import PizzaCheckers from './PizzaCheckers';
import PizzaJump from './PizzaJump';
import DisabledGameScreen from './DisabledGameScreen';

interface GameZoneProps {
  onScoreUpdate: (points: number) => void;
  language: Language;
  gamesStatus?: GamesConfig; // Optional for now, but passed from App
}

type GameType = GameId; // Sync with types

// --- GAME CONFIGURATION & LORE ---
const GAMES_CONFIG: Record<string, any> = {
  runner: {
    id: 'runner',
    title: { ru: 'CYBER RUSH 3D', en: 'CYBER RUSH 3D' },
    desc: { 
      ru: 'Вы — курьер будущего. Город не спит, и пицца сама себя не доставит.', 
      en: 'You are a courier of the future. The city never sleeps, and pizza won\'t deliver itself.' 
    },
    objective: {
      ru: 'Уклоняйтесь от препятствий, собирайте пиццу и не врезайтесь в автобусы!',
      en: 'Dodge obstacles, collect pizzas, and don\'t crash into buses!'
    },
    controls: { type: 'keyboard', label: { ru: 'Стрелки / WASD', en: 'Arrows / WASD' } },
    icon: <Gamepad2 className="w-12 h-12 text-pink-500" />,
    color: 'border-pink-500 shadow-pink-500/20'
  },
  jump: {
    id: 'jump',
    title: { ru: 'PIZZA JUMP', en: 'PIZZA JUMP' },
    desc: { 
      ru: 'Гравитация отключена. Доставка на МКС уже в пути.', 
      en: 'Gravity is offline. ISS delivery is on the way.' 
    },
    objective: {
      ru: 'Прыгайте по платформам, используйте джетпаки и избегайте дронов.',
      en: 'Jump on platforms, use jetpacks, and avoid drones.'
    },
    controls: { type: 'keyboard', label: { ru: 'Стрелки Влево/Вправо', en: 'Arrows Left/Right' } },
    icon: <Rocket className="w-12 h-12 text-red-500" />,
    color: 'border-red-500 shadow-red-500/20'
  },
  snake: {
    id: 'snake',
    title: { ru: 'PIZZA SNAKE RETRO', en: 'PIZZA SNAKE RETRO' },
    desc: { 
      ru: 'Классика 90-х в новой неоновой обертке.', 
      en: '90s classic wrapped in a new neon shell.' 
    },
    objective: {
      ru: 'Собирайте пиццу, растите хвост и не кусайте себя!',
      en: 'Collect pizza, grow your tail, and don\'t bite yourself!'
    },
    controls: { type: 'keyboard', label: { ru: 'Стрелки', en: 'Arrows' } },
    icon: <PlayCircle className="w-12 h-12 text-green-500" />,
    color: 'border-green-500 shadow-green-500/20'
  },
  stacker: {
    id: 'stacker',
    title: { ru: 'PIZZA TOWER', en: 'PIZZA TOWER' },
    desc: { 
      ru: 'Строим самую высокую башню из коробок в истории.', 
      en: 'Building the tallest box tower in history.' 
    },
    objective: {
      ru: 'Кликайте вовремя, чтобы сложить коробки ровно. Промахи обрезают башню.',
      en: 'Click in time to stack boxes perfectly. Misses slice the tower.'
    },
    controls: { type: 'mouse', label: { ru: 'Клик / Пробел', en: 'Click / Space' } },
    icon: <Box className="w-12 h-12 text-yellow-500" />,
    color: 'border-yellow-500 shadow-yellow-500/20'
  },
  kitchen: {
    id: 'kitchen',
    title: { ru: 'ШЕФ ЛЮБЛЮPIZZA', en: 'CHEF PIZZA PRO' },
    desc: { 
      ru: 'Симулятор кухни. Заказы идут, печь горит!', 
      en: 'Kitchen simulator. Orders coming in, oven is hot!'
    },
    objective: {
      ru: 'Готовьте по рецепту, следите за печью и режьте ровно.',
      en: 'Cook by recipe, watch the oven, and slice evenly.'
    },
    controls: { type: 'mouse', label: { ru: 'Мышь (Drag & Drop)', en: 'Mouse (Drag & Drop)' } },
    icon: <ChefHat className="w-12 h-12 text-orange-500" />,
    color: 'border-orange-500 shadow-orange-500/20'
  },
  checkers: {
    id: 'checkers',
    title: { ru: 'PIZZA CHECKERS', en: 'PIZZA CHECKERS' },
    desc: { 
      ru: 'Интеллектуальная битва за последний кусок.', 
      en: 'Intellectual battle for the last slice.' 
    },
    objective: {
      ru: 'Съешьте все грибы противника. Пепперони должны победить!',
      en: 'Eat all opponent mushrooms. Pepperoni must win!'
    },
    controls: { type: 'mouse', label: { ru: 'Мышь (Клик)', en: 'Mouse (Click)' } },
    icon: <Flag className="w-12 h-12 text-blue-500" />,
    color: 'border-blue-500 shadow-blue-500/20'
  }
};

const GameIntroCard = ({ config, language, onPlay }: { config: any, language: Language, onPlay: () => void }) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className={`relative w-full max-w-2xl bg-gray-900 border-4 ${config.color} rounded-[2rem] p-8 md:p-12 text-center shadow-2xl overflow-hidden flex flex-col items-center m-4 z-20`}>
            
            {/* Background Animation */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none"></div>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] ${config.color.replace('border', 'bg').replace('500', '500/20')} blur-[80px] rounded-full pointer-events-none`}></div>

            <div className="relative z-10 flex flex-col items-center w-full pointer-events-auto">
                <div className={`w-24 h-24 rounded-full bg-gray-800 border-2 ${config.color} flex items-center justify-center mb-6 shadow-lg animate-[float_3s_ease-in-out_infinite]`}>
                    {config.icon}
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-lg">
                    {config.title[language]}
                </h2>

                <p className="text-gray-400 text-lg mb-8 font-mono max-w-lg leading-relaxed">
                    {config.desc[language]}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" /> {language === 'ru' ? 'ЦЕЛЬ' : 'GOAL'}
                        </div>
                        <p className="text-white text-sm font-bold">
                            {config.objective[language]}
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        {config.controls.type === 'keyboard' ? <Keyboard className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
                        {language === 'ru' ? 'УПРАВЛЕНИЕ' : 'CONTROLS'}
                        </div>
                        <p className="text-white text-sm font-bold">
                            {config.controls.label[language]}
                        </p>
                    </div>
                </div>

                <div className="relative z-50">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlay();
                        }}
                        className={`px-12 py-4 bg-white text-black font-black text-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 hover:bg-gray-200 transition-all flex items-center gap-3 cursor-pointer`}
                    >
                        <PlayCircle className="w-6 h-6 fill-current" />
                        {language === 'ru' ? 'ИГРАТЬ' : 'PLAY NOW'}
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
}

const GameZone: React.FC<GameZoneProps> = ({ onScoreUpdate, language, gamesStatus }) => {
  const [selectedGame, setSelectedGame] = useState<GameType>('runner');
  const [showIntro, setShowIntro] = useState(true);

  const handleSelectGame = (game: GameType) => {
      if (selectedGame !== game) {
          setSelectedGame(game);
          setShowIntro(true);
      }
  };

  const handleGameOver = (score: number) => {
    onScoreUpdate(score);
  };

  const t = {
    title: language === 'ru' ? 'ИГРОВАЯ ЗОНА' : 'GAME ZONE',
    desc: language === 'ru' ? 'Играй, чтобы заработать скидки!' : 'Play to earn discounts!',
  };

  const isGameEnabled = gamesStatus ? gamesStatus[selectedGame] : true;

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-gray-700 pb-4">
        <div>
           <h2 className="text-3xl md:text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
             {t.title}
           </h2>
           <p className="text-gray-400 mt-2 flex items-center gap-2">
             <Gamepad2 className="w-4 h-4" /> {t.desc}
           </p>
        </div>
      </div>

      {/* Game Selector */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
         <button 
           onClick={() => handleSelectGame('runner')}
           className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedGame === 'runner' ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
         >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${selectedGame === 'runner' ? 'bg-pink-500 text-white' : 'bg-gray-700'}`}>🏎️</div>
            <div className="text-left">
                <div className={`font-black italic ${selectedGame === 'runner' ? 'text-white' : 'text-gray-400'}`}>CYBER RUSH</div>
                <div className="text-xs text-gray-500">Racing</div>
            </div>
         </button>

         <button 
           onClick={() => handleSelectGame('jump')}
           className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedGame === 'jump' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
         >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${selectedGame === 'jump' ? 'bg-red-500 text-white' : 'bg-gray-700'}`}>🚀</div>
            <div className="text-left">
                <div className={`font-black font-mono ${selectedGame === 'jump' ? 'text-white' : 'text-gray-400'}`}>PIZZA JUMP</div>
                <div className="text-xs text-gray-500">Platformer</div>
            </div>
         </button>

         <button 
           onClick={() => handleSelectGame('snake')}
           className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedGame === 'snake' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
         >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${selectedGame === 'snake' ? 'bg-green-500 text-black' : 'bg-gray-700'}`}>🐍</div>
            <div className="text-left">
                <div className={`font-black font-mono ${selectedGame === 'snake' ? 'text-white' : 'text-gray-400'}`}>SNAKE</div>
                <div className="text-xs text-gray-500">Retro</div>
            </div>
         </button>

         <button 
           onClick={() => handleSelectGame('stacker')}
           className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedGame === 'stacker' ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
         >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${selectedGame === 'stacker' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>🏗️</div>
            <div className="text-left">
                <div className={`font-black font-mono ${selectedGame === 'stacker' ? 'text-white' : 'text-gray-400'}`}>TOWER</div>
                <div className="text-xs text-gray-500">Arcade</div>
            </div>
         </button>
         
         <button 
           onClick={() => handleSelectGame('kitchen')}
           className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedGame === 'kitchen' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
         >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${selectedGame === 'kitchen' ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>👨‍🍳</div>
            <div className="text-left">
                <div className={`font-black font-mono ${selectedGame === 'kitchen' ? 'text-white' : 'text-gray-400'}`}>CHEF PRO</div>
                <div className="text-xs text-gray-500">Simulation</div>
            </div>
         </button>

         <button 
           onClick={() => handleSelectGame('checkers')}
           className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedGame === 'checkers' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
         >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${selectedGame === 'checkers' ? 'bg-blue-500 text-white' : 'bg-gray-700'}`}>🏁</div>
            <div className="text-left">
                <div className={`font-black font-mono ${selectedGame === 'checkers' ? 'text-white' : 'text-gray-400'}`}>CHECKERS</div>
                <div className="text-xs text-gray-500">Strategy</div>
            </div>
         </button>
      </div>

      {/* The Main Game Container */}
      <div className="relative w-full min-h-[600px] rounded-3xl overflow-hidden border border-gray-800 bg-black">
         
         {!isGameEnabled && (
             <DisabledGameScreen title={GAMES_CONFIG[selectedGame].title[language]} language={language} />
         )}

         {/* Only Render if Enabled */}
         {!showIntro && isGameEnabled && (
             <>
                {selectedGame === 'runner' && <PizzaRunner onGameOver={handleGameOver} language={language} isActive={true} autoStart={true} />}
                {selectedGame === 'jump' && <PizzaJump onGameOver={handleGameOver} language={language} autoStart={true} />}
                {selectedGame === 'snake' && <PizzaSnake onGameOver={handleGameOver} language={language} autoStart={true} />}
                {selectedGame === 'stacker' && <PizzaStacker onGameOver={handleGameOver} language={language} autoStart={true} />}
                {selectedGame === 'kitchen' && <PizzaKitchen onGameOver={handleGameOver} language={language} autoStart={true} />}
                {selectedGame === 'checkers' && <PizzaCheckers onGameOver={handleGameOver} language={language} autoStart={true} />}
             </>
         )}

         {/* INTRO OVERLAY - Only if enabled */}
         {showIntro && isGameEnabled && (
             <GameIntroCard 
                config={GAMES_CONFIG[selectedGame]} 
                language={language} 
                onPlay={() => setShowIntro(false)} 
             />
         )}
      </div>

      {/* Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-gray-600 uppercase tracking-widest font-mono">
         <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
            Status: {isGameEnabled ? 'Online' : 'Maintenance'}
         </div>
         <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
            Server: Kursk-1
         </div>
         <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
            Ping: 12ms
         </div>
      </div>
    </div>
  );
};

export default GameZone;
