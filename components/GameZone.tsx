
import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Gamepad2, PlayCircle, ChefHat, Grid3X3, ArrowUpCircle, Info, Keyboard, MousePointer, Hand, Rocket, Box, Flag, X, BrainCircuit, Disc, Puzzle, Ticket } from 'lucide-react';
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
import { useResponsiveGameViewport } from '../hooks/useResponsiveGameViewport';

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
    controls: { type: 'keyboard', label: { ru: 'Свайп / Тап', en: 'Swipe / Tap' } }, // MOBILE OPTIMIZATION
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
    controls: { type: 'keyboard', label: { ru: 'Тап лево/право', en: 'Tap Left/Right' } }, // MOBILE OPTIMIZATION
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
    controls: { type: 'keyboard', label: { ru: 'Свайпы', en: 'Swipes' } }, // MOBILE OPTIMIZATION
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
    controls: { type: 'mouse', label: { ru: 'Тап по экрану', en: 'Tap screen' } }, // MOBILE OPTIMIZATION
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
    controls: { type: 'mouse', label: { ru: 'Тач / Перетаскивание', en: 'Touch / Drag' } }, // MOBILE OPTIMIZATION
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
    controls: { type: 'mouse', label: { ru: 'Тап', en: 'Tap' } }, // MOBILE OPTIMIZATION
    icon: <Flag className="w-12 h-12 text-blue-500" />,
    color: 'border-blue-500 shadow-blue-500/20'
  },
  quiz: {
    id: 'quiz',
    title: { ru: 'ВИКТОРИНА', en: 'CYBER TRIVIA' },
    desc: { ru: 'Проверь свои знания о пицце и истории.', en: 'Test your knowledge about pizza and history.' },
    objective: { ru: 'Отвечай правильно и быстро, чтобы заработать максимум очков.', en: 'Answer correctly and quickly to earn max points.' },
    controls: { type: 'mouse', label: { ru: 'Тап', en: 'Tap' } },
    icon: <BrainCircuit className="w-12 h-12 text-purple-500" />,
    color: 'border-purple-500 shadow-purple-500/20'
  },
  wheel: {
    id: 'wheel',
    title: { ru: 'КОЛЕСО ФОРТУНЫ', en: 'WHEEL OF FORTUNE' },
    desc: { ru: 'Испытай удачу и выиграй призы.', en: 'Test your luck and win prizes.' },
    objective: { ru: 'Крути колесо и получай бонусы, скидки или очки.', en: 'Spin the wheel to get bonuses, discounts or points.' },
    controls: { type: 'mouse', label: { ru: 'Тап', en: 'Tap' } },
    icon: <Disc className="w-12 h-12 text-yellow-500" />,
    color: 'border-yellow-500 shadow-yellow-500/20'
  },
  puzzle: {
    id: 'puzzle',
    title: { ru: 'ПАЗЛЫ', en: 'PUZZLE' },
    desc: { ru: 'Собери картинку из кусочков.', en: 'Assemble the picture from pieces.' },
    objective: { ru: 'Меняй плитки местами, чтобы восстановить изображение.', en: 'Swap tiles to reconstruct the image.' },
    controls: { type: 'mouse', label: { ru: 'Тап / Свап', en: 'Tap / Swap' } },
    icon: <Puzzle className="w-12 h-12 text-blue-400" />,
    color: 'border-blue-400 shadow-blue-400/20'
  },
  scratch: {
    id: 'scratch',
    title: { ru: 'СЧАСТЛИВАЯ КАРТА', en: 'LUCKY CARD' },
    desc: { ru: 'Сотри слой и найди приз.', en: 'Scratch the layer and find a prize.' },
    objective: { ru: 'Води пальцем по карте, чтобы стереть защитный слой.', en: 'Move your finger over the card to scratch off the layer.' },
    controls: { type: 'mouse', label: { ru: 'Свайп', en: 'Swipe' } },
    icon: <Ticket className="w-12 h-12 text-green-500" />,
    color: 'border-green-500 shadow-green-500/20'
  }
};

const GameIntroCard = ({ config, language, onPlay }: { config: any, language: Language, onPlay: () => void }) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-4">
        <div className={`relative w-full max-w-2xl bg-gray-900 border-4 ${config.color} rounded-[2rem] p-6 md:p-12 text-center shadow-2xl overflow-hidden flex flex-col items-center z-20 max-h-full overflow-y-auto custom-scrollbar`}>
            
            {/* Background Animation */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none"></div>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] ${config.color.replace('border', 'bg').replace('500', '500/20')} blur-[80px] rounded-full pointer-events-none`}></div>

            <div className="relative z-10 flex flex-col items-center w-full pointer-events-auto">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800 border-2 ${config.color} flex items-center justify-center mb-6 shadow-lg animate-[float_3s_ease-in-out_infinite] shrink-0`}>
                    {config.icon}
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-lg">
                    {config.title[language]}
                </h2>

                <p className="text-gray-400 text-sm md:text-lg mb-8 font-mono max-w-lg leading-relaxed">
                    {config.desc[language]}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full mb-10">
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
                        {config.controls.type === 'keyboard' ? <Hand className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
                        {language === 'ru' ? 'УПРАВЛЕНИЕ' : 'CONTROLS'}
                        </div>
                        <p className="text-white text-sm font-bold">
                            {config.controls.label[language]}
                        </p>
                    </div>
                </div>

                <div className="relative z-50 w-full md:w-auto">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlay();
                        }}
                        className={`w-full md:w-auto px-12 py-4 bg-white text-black font-black text-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 hover:bg-gray-200 transition-all flex items-center justify-center gap-3 cursor-pointer`}
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
  const viewportOptions = useMemo(() => ({
    fillHeight: showIntro ? 0.9 : 0.96,
    fillWidth: showIntro ? 0.86 : 0.92,
    breakpoints: {
      mobile: {
        reservedTop: 210,
        reservedBottom: 120,
        minHeight: 480,
        minWidth: 360,
        horizontalPadding: 12,
      },
      tablet: {
        reservedTop: 240,
        reservedBottom: 90,
        minHeight: 560,
        minWidth: 620,
        horizontalPadding: 24,
      },
      desktop: {
        reservedTop: 240,
        reservedBottom: 120,
        minHeight: 720,
        minWidth: 840,
        fillHeight: showIntro ? 0.9 : 0.94,
        fillWidth: showIntro ? 0.88 : 0.92,
        horizontalPadding: 40,
      },
    },
  }), [showIntro]);

  // Single responsive stage sizing source
  const { stageHeight, stageWidth, viewport, isMobile, isTablet, isDesktop } = useResponsiveGameViewport(viewportOptions);

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
  const isPlaying = !showIntro && isGameEnabled;

  // Fullscreen is only active when playing AND on mobile
  const fullscreenActive = isPlaying && isMobile;

  const heightCeiling = useMemo(
    () => Math.max(viewport.height - (isMobile ? 24 : 96), 320),
    [viewport.height, isMobile]
  );

  const cappedStageHeight = useMemo(
    () => Math.min(stageHeight, heightCeiling),
    [stageHeight, heightCeiling]
  );

  const cappedStageWidth = useMemo(
    () => Math.min(stageWidth, viewport.width - (isMobile ? 16 : isTablet ? 32 : 80)),
    [stageWidth, viewport.width, isMobile, isTablet]
  );

  const stageMaxWidth = useMemo(
    () => {
      const gutter = isMobile ? 12 : isTablet ? 28 : 96;
      const available = Math.max(viewport.width - gutter * 2, 320);
      const desktopHardCap = isDesktop ? 1280 : Infinity;
      return Math.min(cappedStageWidth, available, desktopHardCap);
    },
    [cappedStageWidth, isDesktop, isMobile, isTablet, viewport.width]
  );

  const stageContentWidth = useMemo(
    () => Math.min(stageMaxWidth, cappedStageWidth),
    [cappedStageWidth, stageMaxWidth]
  );

  const stageContainerStyle = useMemo(() => ({
    height: cappedStageHeight,
    maxHeight: fullscreenActive ? 'calc(100dvh - 12px)' : `min(${cappedStageHeight}px, ${heightCeiling}px)`,
    maxWidth: fullscreenActive ? '100%' : stageMaxWidth,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginInline: 'auto',
    paddingInline: isDesktop ? 16 : 8,
    overflow: 'hidden',
    boxSizing: 'border-box' as const,
  }), [cappedStageHeight, fullscreenActive, heightCeiling, isDesktop, stageMaxWidth]);

  const stageFrameStyle = useMemo(() => ({
    paddingTop: fullscreenActive ? 'env(safe-area-inset-top)' : 0,
    paddingBottom: fullscreenActive ? 'env(safe-area-inset-bottom)' : 0,
    touchAction: fullscreenActive ? 'none' : 'manipulation',
    maxWidth: '100%',
    width: stageContentWidth,
    height: cappedStageHeight,
    marginInline: 'auto',
    borderRadius: fullscreenActive ? '18px' : undefined,
    overflow: 'hidden',
    boxSizing: 'border-box' as const
  }), [cappedStageHeight, fullscreenActive, stageContentWidth]);

  // 2. Lock Scroll & Gestures ONLY in Fullscreen Mode
  useEffect(() => {
    if (fullscreenActive) {
      // Disable scroll and gestures for mobile fullscreen
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      
      const preventDefault = (e: TouchEvent) => {
          // Allow multi-touch gestures if needed for game, but prevent browser nav
          if (e.touches.length > 1) return; 
          e.preventDefault();
      };

      // Aggressive listener to prevent scroll/swipe nav on mobile
      window.addEventListener('touchmove', preventDefault, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overscrollBehavior = '';
        window.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [fullscreenActive]);

  const selectorButtons = (
    <div
      className={
        isDesktop
          ? 'flex flex-col gap-3'
          : 'flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x touch-pan-x'
      }
    >
      {Object.entries(GAMES_CONFIG).map(([key, config]) => (
        <button
          key={key}
          onClick={() => handleSelectGame(key as GameType)}
          className={`
            snap-start rounded-xl border-2 transition-all group w-full
            ${isDesktop ? 'flex items-center gap-4 p-4' : 'flex-none w-[200px] p-4 flex items-center gap-4'}
            ${selectedGame === key ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}
          `}
        >
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${
              selectedGame === key ? 'bg-pink-500 text-white' : 'bg-gray-700'
            }`}
          >
            {config.icon}
          </div>
          <div className="text-left overflow-hidden">
            <div
              className={`font-black italic truncate ${selectedGame === key ? 'text-white' : 'text-gray-400'}`}
            >
              {config.title[language]}
            </div>
            <div className="text-xs text-gray-500">{key === 'quiz' || key === 'wheel' ? 'Bonus' : 'Arcade'}</div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10"
      style={{ minHeight: 'min(1200px, 100dvh)' }}
    >
      <div className="flex flex-col gap-6 lg:gap-8">
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

        {/* 3. Dual Mode Container Logic */}
        <div
          className={
            fullscreenActive
              ? 'fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center'
              : 'relative w-full rounded-3xl border border-gray-800 bg-black z-10'
          }
          style={stageContainerStyle}
        >
          {/* Content Wrapper / Stage */}
          <div
            className={`
                relative overflow-hidden touch-none select-none w-full h-full
                ${fullscreenActive ? 'max-w-[520px] max-h-[calc(100dvh-80px)] mx-auto rounded-xl border border-gray-800/50' : ''}
            `}
            style={stageFrameStyle}
          >
            {!isGameEnabled && (
              <DisabledGameScreen title={GAMES_CONFIG[selectedGame].title[language]} language={language} />
            )}

            {/* Active Game */}
            {isPlaying && (
              <>
                {/* Close Button - Always Visible */}
                <button
                  onClick={() => setShowIntro(true)}
                  className="absolute top-4 right-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors border border-white/20"
                  style={{ marginTop: fullscreenActive ? 'env(safe-area-inset-top)' : 0 }}
                >
                  <X className="w-6 h-6" />
                </button>

                {selectedGame === 'runner' && (
                  <PizzaRunner onGameOver={handleGameOver} language={language} isActive={true} autoStart={true} />
                )}
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

            {/* INTRO OVERLAY */}
            {showIntro && isGameEnabled && (
              <GameIntroCard
                config={GAMES_CONFIG[selectedGame]}
                language={language}
                onPlay={() => setShowIntro(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-pink-400 font-bold mb-2">
            <Grid3X3 className="w-4 h-4" /> {language === 'ru' ? 'Библиотека игр' : 'Game library'}
          </div>
          {selectorButtons}
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-black text-white uppercase tracking-wide">
              {GAMES_CONFIG[selectedGame].title[language]}
            </div>
            <div className={`text-[11px] px-2 py-1 rounded-full ${isGameEnabled ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-200'}`}>
              {isGameEnabled ? 'Online' : 'Maintenance'}
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {GAMES_CONFIG[selectedGame].desc[language]}
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                <Info className="w-4 h-4" /> {language === 'ru' ? 'Цель' : 'Goal'}
              </div>
              <div className="font-semibold text-white/90 leading-snug">
                {GAMES_CONFIG[selectedGame].objective[language]}
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                {GAMES_CONFIG[selectedGame].controls.type === 'keyboard' ? (
                  <Keyboard className="w-4 h-4" />
                ) : (
                  <MousePointer className="w-4 h-4" />
                )}
                {language === 'ru' ? 'Управление' : 'Controls'}
              </div>
              <div className="font-semibold text-white/90 leading-snug">
                {GAMES_CONFIG[selectedGame].controls.label[language]}
              </div>
            </div>
          </div>
          {showIntro && (
            <button
              onClick={() => setShowIntro(false)}
              className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-black shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.55)] transition"
            >
              {language === 'ru' ? 'Играть' : 'Play now'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-3 text-center text-xs text-gray-600 uppercase tracking-widest font-mono">
          <div className="bg-gray-900/50 p-3 rounded border border-gray-800">Status: {isGameEnabled ? 'Online' : 'Maintenance'}</div>
          <div className="bg-gray-900/50 p-3 rounded border border-gray-800">Server: Kursk-1</div>
          <div className="bg-gray-900/50 p-3 rounded border border-gray-800">Ping: 12ms</div>
        </div>
      </aside>
    </div>
  );
};

export default GameZone;
