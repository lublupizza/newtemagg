
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
  gamesStatus?: GamesConfig;
}

type GameType = GameId;

// КОНФИГУРАЦИЯ С ORIENTATION (ВАЖНО!)
const GAMES_CONFIG: Record<string, any> = {
  runner: {
    id: 'runner',
    title: { ru: 'CYBER RUSH 3D', en: 'CYBER RUSH 3D' },
    desc: { ru: 'Курьер будущего. Город не спит.', en: 'Future courier.' },
    objective: { ru: 'Уклоняйтесь от препятствий.', en: 'Dodge obstacles.' },
    controls: { type: 'keyboard', label: { ru: 'Стрелки / Свайп', en: 'Arrows / Swipe' } },
    icon: <Gamepad2 className="w-12 h-12 text-pink-500" />,
    color: 'border-pink-500 shadow-pink-500/20',
    orientation: 'portrait' // ВЕРТИКАЛЬНАЯ
  },
  jump: {
    id: 'jump',
    title: { ru: 'PIZZA JUMP', en: 'PIZZA JUMP' },
    desc: { ru: 'Гравитация отключена.', en: 'Gravity offline.' },
    objective: { ru: 'Прыгайте по платформам.', en: 'Jump on platforms.' },
    controls: { type: 'keyboard', label: { ru: 'Тап лево/право', en: 'Tap Left/Right' } },
    icon: <Rocket className="w-12 h-12 text-red-500" />,
    color: 'border-red-500 shadow-red-500/20',
    orientation: 'portrait' // ВЕРТИКАЛЬНАЯ
  },
  snake: {
    id: 'snake',
    title: { ru: 'PIZZA SNAKE', en: 'PIZZA SNAKE' },
    desc: { ru: 'Классика.', en: 'Classic.' },
    objective: { ru: 'Собирайте пиццу.', en: 'Collect pizza.' },
    controls: { type: 'keyboard', label: { ru: 'Стрелки', en: 'Arrows' } },
    icon: <PlayCircle className="w-12 h-12 text-green-500" />,
    color: 'border-green-500 shadow-green-500/20',
    orientation: 'portrait' // ВЕРТИКАЛЬНАЯ
  },
  stacker: {
    id: 'stacker',
    title: { ru: 'PIZZA TOWER', en: 'PIZZA TOWER' },
    desc: { ru: 'Строим башню.', en: 'Build tower.' },
    objective: { ru: 'Кликайте вовремя.', en: 'Click in time.' },
    controls: { type: 'mouse', label: { ru: 'Клик', en: 'Click' } },
    icon: <Box className="w-12 h-12 text-yellow-500" />,
    color: 'border-yellow-500 shadow-yellow-500/20',
    orientation: 'portrait' // ВЕРТИКАЛЬНАЯ
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
  quiz: { id: 'quiz', title: { ru: 'ВИКТОРИНА', en: 'QUIZ' }, desc: { ru: '', en: '' }, objective: { ru: '', en: '' }, controls: { type: 'mouse', label: { ru: '', en: '' } }, icon: <BrainCircuit className="w-12 h-12 text-purple-500" />, color: 'border-purple-500', orientation: 'landscape' },
  wheel: { id: 'wheel', title: { ru: 'КОЛЕСО', en: 'WHEEL' }, desc: { ru: '', en: '' }, objective: { ru: '', en: '' }, controls: { type: 'mouse', label: { ru: '', en: '' } }, icon: <Disc className="w-12 h-12 text-yellow-500" />, color: 'border-yellow-500', orientation: 'square' },
  puzzle: { id: 'puzzle', title: { ru: 'ПАЗЛ', en: 'PUZZLE' }, desc: { ru: '', en: '' }, objective: { ru: '', en: '' }, controls: { type: 'mouse', label: { ru: '', en: '' } }, icon: <Puzzle className="w-12 h-12 text-blue-400" />, color: 'border-blue-400', orientation: 'landscape' },
  scratch: { id: 'scratch', title: { ru: 'СКРЕТЧ', en: 'SCRATCH' }, desc: { ru: '', en: '' }, objective: { ru: '', en: '' }, controls: { type: 'mouse', label: { ru: '', en: '' } }, icon: <Ticket className="w-12 h-12 text-green-500" />, color: 'border-green-500', orientation: 'portrait' },
};

const GameIntroCard = ({ config, language, onPlay }: { config: any; language: Language; onPlay: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
    <div className={`relative w-full max-w-md bg-gray-900 border-2 ${config.color} rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center`}>
      <div className={`w-20 h-20 rounded-full bg-gray-800 border-2 ${config.color} flex items-center justify-center mb-6 shadow-lg shrink-0`}>
        {config.icon}
      </div>
      <h2 className="text-3xl font-black text-white italic tracking-tighter mb-4">{config.title[language]}</h2>
      <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="w-full py-4 bg-white text-black font-black text-xl rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
        <PlayCircle className="w-6 h-6 fill-current" /> {language === 'ru' ? 'ИГРАТЬ' : 'PLAY'}
      </button>
    </div>
  </div>
);

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

  const handleGameOver = (score: number) => onScoreUpdate(score);
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
    if (orientation === 'square') {
      return { ...baseStyle, width: '100%', maxWidth: '600px', aspectRatio: '1/1', height: 'auto', maxHeight: '800px' };
    }
    return { ...baseStyle, width: '100%', height: '100%', minHeight: '600px' };
  }, [isMobile, config]);

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
