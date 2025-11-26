import React, { useState } from 'react';
import { Trophy, Gamepad2, PlayCircle, ChefHat, Grid3X3, Info, Keyboard, MousePointer, Hand, Rocket, Box, Flag, X, BrainCircuit, Disc, Puzzle, Ticket } from 'lucide-react';
import { Language, GamesConfig, GameId } from '../types';
import PizzaRunner from './PizzaRunner';
import PizzaSnake from './PizzaSnake';
import PizzaStacker from './PizzaStacker';
import PizzaKitchen from './PizzaKitchen';
import PizzaCheckers from './PizzaCheckers';
import PizzaJump from './PizzaJump';
import QuizGame from './QuizGame';
import WheelFortune from './WheelFortune';
import PuzzleGame from './PuzzleGame';
import ScratchGame from './ScratchGame';
import DisabledGameScreen from './DisabledGameScreen';

interface GameZoneProps {
  onScoreUpdate: (points: number) => void;
  language: Language;
  gamesStatus?: GamesConfig;
}

type GameType = GameId;

// КОНФИГУРАЦИЯ
const GAMES_CONFIG: Record<string, any> = {
  runner: {
    id: 'runner',
    title: { ru: 'CYBER RUSH 3D', en: 'CYBER RUSH 3D' },
    desc: { ru: 'Курьер будущего.', en: 'Future courier.' },
    objective: { ru: 'Уклоняйтесь от препятствий.', en: 'Dodge obstacles.' },
    controls: { type: 'keyboard', label: { ru: 'Стрелки / Свайп', en: 'Arrows / Swipe' } },
    icon: <Gamepad2 className="w-12 h-12 text-pink-500" />,
    color: 'border-pink-500 shadow-pink-500/20',
    orientation: 'portrait' // ВЕРТИКАЛЬНАЯ (ВАЖНО)
  },
  jump: {
    id: 'jump',
    title: { ru: 'PIZZA JUMP', en: 'PIZZA JUMP' },
    desc: { ru: 'Гравитация отключена.', en: 'Gravity offline.' },
    objective: { ru: 'Прыгайте по платформам.', en: 'Jump on platforms.' },
    controls: { type: 'keyboard', label: { ru: 'Тап лево/право', en: 'Tap Left/Right' } },
    icon: <Rocket className="w-12 h-12 text-red-500" />,
    color: 'border-red-500 shadow-red-500/20',
    orientation: 'portrait'
  },
  snake: {
    id: 'snake',
    title: { ru: 'PIZZA SNAKE', en: 'PIZZA SNAKE' },
    desc: { ru: 'Классика.', en: 'Classic.' },
    objective: { ru: 'Собирайте пиццу.', en: 'Collect pizza.' },
    controls: { type: 'keyboard', label: { ru: 'Стрелки', en: 'Arrows' } },
    icon: <PlayCircle className="w-12 h-12 text-green-500" />,
    color: 'border-green-500 shadow-green-500/20',
    orientation: 'portrait'
  },
  stacker: {
    id: 'stacker',
    title: { ru: 'PIZZA TOWER', en: 'PIZZA TOWER' },
    desc: { ru: 'Строим башню.', en: 'Build tower.' },
    objective: { ru: 'Кликайте вовремя.', en: 'Click in time.' },
    controls: { type: 'mouse', label: { ru: 'Клик', en: 'Click' } },
    icon: <Box className="w-12 h-12 text-yellow-500" />,
    color: 'border-yellow-500 shadow-yellow-500/20',
    orientation: 'portrait'
  },
  kitchen: {
    id: 'kitchen',
    title: { ru: 'CHEF PIZZA', en: 'CHEF PIZZA' },
    desc: { ru: 'Готовка.', en: 'Cooking.' },
    objective: { ru: 'Выполняй заказы.', en: 'Orders.' },
    controls: { type: 'mouse', label: { ru: 'Драг', en: 'Drag' } },
    icon: <ChefHat className="w-12 h-12 text-orange-500" />,
    color: 'border-orange-500 shadow-orange-500/20',
    orientation: 'landscape' // ГОРИЗОНТАЛЬНАЯ
  },
  checkers: {
    id: 'checkers',
    title: { ru: 'CHECKERS', en: 'CHECKERS' },
    desc: { ru: 'Шашки.', en: 'Checkers.' },
    objective: { ru: 'Победи.', en: 'Win.' },
    controls: { type: 'mouse', label: { ru: 'Клик', en: 'Click' } },
    icon: <Flag className="w-12 h-12 text-blue-500" />,
    color: 'border-blue-500 shadow-blue-500/20',
    orientation: 'square' // КВАДРАТНАЯ
  },
  quiz: { id: 'quiz', title: { ru: 'ВИКТОРИНА', en: 'QUIZ' }, desc: {ru:'',en:''}, objective: {ru:'',en:''}, controls: {type:'mouse', label:{ru:'',en:''}}, icon: <BrainCircuit className="w-12 h-12 text-purple-500"/>, color: 'border-purple-500', orientation: 'landscape'},
  wheel: { id: 'wheel', title: { ru: 'КОЛЕСО', en: 'WHEEL' }, desc: {ru:'',en:''}, objective: {ru:'',en:''}, controls: {type:'mouse', label:{ru:'',en:''}}, icon: <Disc className="w-12 h-12 text-yellow-500"/>, color: 'border-yellow-500', orientation: 'square'},
  puzzle: { id: 'puzzle', title: { ru: 'ПАЗЛ', en: 'PUZZLE' }, desc: {ru:'',en:''}, objective: {ru:'',en:''}, controls: {type:'mouse', label:{ru:'',en:''}}, icon: <Puzzle className="w-12 h-12 text-blue-400"/>, color: 'border-blue-400', orientation: 'landscape'},
  scratch: { id: 'scratch', title: { ru: 'СКРЕТЧ', en: 'SCRATCH' }, desc: {ru:'',en:''}, objective: {ru:'',en:''}, controls: {type:'mouse', label:{ru:'',en:''}}, icon: <Ticket className="w-12 h-12 text-green-500"/>, color: 'border-green-500', orientation: 'portrait'},
};

const GameIntroCard = ({ config, language, onPlay }: { config: any, language: Language, onPlay: () => void }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className={`relative w-full max-w-md bg-gray-900 border-2 ${config.color} rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center`}>
            <div className={`w-20 h-20 rounded-full bg-gray-800 border-2 ${config.color} flex items-center justify-center mb-6 shadow-lg shrink-0`}>
                {config.icon}
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-4">{config.title[language]}</h2>
            <p className="text-gray-400 text-sm mb-8">{config.desc[language]}</p>
            <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="w-full py-4 bg-white text-black font-black text-xl rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <PlayCircle className="w-6 h-6 fill-current" /> {language === 'ru' ? 'ИГРАТЬ' : 'PLAY'}
            </button>
        </div>
    </div>
);

const GameZone: React.FC<GameZoneProps> = ({ onScoreUpdate, language, gamesStatus }) => {
  const [selectedGame, setSelectedGame] = useState<GameType>('runner');
  const [showIntro, setShowIntro] = useState(true);

  const handleSelectGame = (game: GameType) => {
      if (selectedGame !== game) {
          setSelectedGame(game);
          setShowIntro(true);
      }
  };

  const handleGameOver = (score: number) => onScoreUpdate(score);
  const isGameEnabled = gamesStatus ? gamesStatus[selectedGame] : true;
  const isPlaying = !showIntro && isGameEnabled;
  const config = GAMES_CONFIG[selectedGame];

  // --- ЖЕСТКИЙ STYLE OBJECT (БЕЗ TAILWIND) ---
  const orientation = config.orientation || 'landscape';
  const isPortrait = orientation === 'portrait';
  const isSquare = orientation === 'square';

  const frameStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    maxWidth: isPortrait ? '450px' : isSquare ? '600px' : '100%',
    aspectRatio: isPortrait ? '9/16' : isSquare ? '1/1' : 'auto',
    maxHeight: isPortrait ? '800px' : isSquare ? '600px' : '600px',
    minHeight: isPortrait ? '600px' : '400px',
    margin: '0 auto',
    position: 'relative',
    backgroundColor: 'black',
    borderRadius: '20px',
    border: '4px solid #333',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  };

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 min-h-[80vh]">
      
      {/* Main Game Area */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-end border-b border-gray-700 pb-4 mb-6">
          <div>
            <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
              {language === 'ru' ? 'ИГРОВАЯ ЗОНА' : 'GAME ZONE'}
            </h2>
            <p className="text-gray-400 mt-1 flex items-center gap-2 text-sm">
              <Gamepad2 className="w-4 h-4" /> {config.title[language]}
            </p>
          </div>
        </div>

        {/* Обертка для центрирования */}
        <div className="flex-1 flex items-center justify-center bg-gray-950/50 rounded-[3rem] border border-gray-800 p-4 lg:p-8 shadow-inner w-full min-h-[600px]">
            
            {/* --- ВОТ ЗДЕСЬ ПРИМЕНЯЕТСЯ ЖЕСТКИЙ СТИЛЬ --- */}
            <div style={frameStyle}>
                {!isGameEnabled && <DisabledGameScreen title={config.title[language]} language={language} />}

                {isPlaying && (
                  <>
                    <button onClick={() => setShowIntro(true)} className="absolute top-4 right-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors border border-white/20">
                      <X className="w-6 h-6" />
                    </button>

                    {selectedGame === 'runner' && <PizzaRunner onGameOver={handleGameOver} language={language} isActive={true} autoStart={true} />}
                    {selectedGame === 'jump' && <PizzaJump onGameOver={handleGameOver} language={language} autoStart={true} />}
                    {selectedGame === 'snake' && <PizzaSnake onGameOver={handleGameOver} language={language} autoStart={true} />}
                    {selectedGame === 'stacker' && <PizzaStacker onGameOver={handleGameOver} language={language} autoStart={true} />}
                    {selectedGame === 'kitchen' && <PizzaKitchen onGameOver={handleGameOver} language={language} autoStart={true} />}
                    {selectedGame === 'checkers' && <PizzaCheckers onGameOver={handleGameOver} language={language} autoStart={true} />}
                    {selectedGame === 'quiz' && <QuizGame onComplete={handleGameOver} language={language} />}
                    {selectedGame === 'wheel' && <WheelFortune onWin={(p, v) => handleGameOver(v > 0 ? v : 0)} language={language} />}
                    {selectedGame === 'puzzle' && <PuzzleGame onComplete={handleGameOver} language={language} />}
                    {selectedGame === 'scratch' && <ScratchGame onWin={(p) => handleGameOver(0)} language={language} />}
                  </>
                )}

                {showIntro && isGameEnabled && (
                  <GameIntroCard config={config} language={language} onPlay={() => setShowIntro(false)} />
                )}
            </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-8 h-fit">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-pink-400 font-bold mb-4">
            <Grid3X3 className="w-4 h-4" /> {language === 'ru' ? 'БИБЛИОТЕКА' : 'LIBRARY'}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {Object.entries(GAMES_CONFIG).map(([key, cfg]) => (
                <button
                key={key}
                onClick={() => handleSelectGame(key as GameType)}
                className={`
                    flex items-center gap-3 p-3 rounded-xl border transition-all text-left group
                    ${selectedGame === key 
                        ? 'bg-gray-800 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                        : 'bg-transparent border-gray-800 hover:bg-gray-800 hover:border-gray-600'}
                `}
                >
                <div className={`p-2 rounded-lg ${selectedGame === key ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-400 group-hover:text-white'}`}>
                    {React.cloneElement(cfg.icon, { className: "w-5 h-5" })}
                </div>
                <div className="min-w-0 hidden md:block">
                    <div className={`text-xs font-bold truncate ${selectedGame === key ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {cfg.title[language]}
                    </div>
                </div>
                </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default GameZone;
