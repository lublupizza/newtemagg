
import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import { Puzzle, RefreshCw, Trophy, Image as ImageIcon, Clock, CheckCircle2, X } from 'lucide-react';

interface PuzzleGameProps {
  language: Language;
  onComplete: (score: number) => void;
}

// High quality cyberpunk/pizza images for the puzzle
const PUZZLE_IMAGES = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Pizza
  "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Neon Pizza
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Classic
];

const PuzzleGame: React.FC<PuzzleGameProps> = ({ language, onComplete }) => {
  const [level, setLevel] = useState<3 | 4 | 5>(3); // Grid size
  const [tiles, setTiles] = useState<{id: number, currentPos: number, correctPos: number}[]>([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImage, setCurrentImage] = useState(PUZZLE_IMAGES[0]);
  const [showPreview, setShowPreview] = useState(false);

  const t = {
    title: language === 'ru' ? 'КИБЕР ПАЗЛ' : 'CYBER PUZZLE',
    desc: language === 'ru' ? 'Собери изображение, меняя плитки местами' : 'Swap tiles to reconstruct the image',
    moves: language === 'ru' ? 'Ходы' : 'Moves',
    time: language === 'ru' ? 'Время' : 'Time',
    easy: language === 'ru' ? 'Легко (3x3)' : 'Easy (3x3)',
    medium: language === 'ru' ? 'Норм (4x4)' : 'Medium (4x4)',
    hard: language === 'ru' ? 'Хард (5x5)' : 'Hard (5x5)',
    newGame: language === 'ru' ? 'Новая Игра' : 'New Game',
    preview: language === 'ru' ? 'Предпросмотр' : 'Preview',
    win: language === 'ru' ? 'СИСТЕМА ВЗЛОМАНА!' : 'SYSTEM HACKED!',
    winDesc: language === 'ru' ? 'Изображение восстановлено' : 'Image reconstructed',
    claim: language === 'ru' ? 'Забрать награду' : 'Claim Reward'
  };

  // Initialize Game
  const startNewGame = (size: 3 | 4 | 5 = level) => {
    setLevel(size);
    setMoves(0);
    setTime(0);
    setIsWon(false);
    setIsPlaying(true);
    setSelectedTileIndex(null);
    
    // Random Image
    const nextImg = PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
    setCurrentImage(nextImg);

    // Create tiles
    const totalTiles = size * size;
    const newTiles = Array.from({ length: totalTiles }, (_, i) => ({
      id: i,
      currentPos: i,
      correctPos: i
    }));

    // Shuffle (Fisher-Yates)
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    // Update currentPos to reflect shuffle
    const shuffledTiles = newTiles.map((t, index) => ({...t, currentPos: index}));
    
    setTiles(shuffledTiles);
  };

  // Timer
  useEffect(() => {
    let interval: any;
    if (isPlaying && !isWon) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  // Handle Tile Click (Swap Mechanic)
  const handleTileClick = (clickedIndex: number) => {
    if (isWon || !isPlaying) return;

    if (selectedTileIndex === null) {
      // Select first tile
      setSelectedTileIndex(clickedIndex);
    } else {
      // Swap with second tile
      if (selectedTileIndex !== clickedIndex) {
        const newTiles = [...tiles];
        const tileA = newTiles[selectedTileIndex];
        const tileB = newTiles[clickedIndex];

        // Swap their data in the array
        newTiles[selectedTileIndex] = tileB;
        newTiles[clickedIndex] = tileA;

        setTiles(newTiles);
        setMoves(m => m + 1);
        
        // Check Win
        const isComplete = newTiles.every((tile, index) => tile.correctPos === index);
        if (isComplete) {
          setIsWon(true);
          setIsPlaying(false);
        }
      }
      // Deselect
      setSelectedTileIndex(null);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const getTileStyle = (index: number, correctPos: number) => {
    const x = (correctPos % level) * (100 / (level - 1)); // Correct X % for background
    const y = (Math.floor(correctPos / level)) * (100 / (level - 1)); // Correct Y % for background
    
    // Prevent division by zero for css calc if needed, but percentage works best here.
    // Background position needs to shift based on the grid size.
    // For 3x3: 0%, 50%, 100%
    
    return {
      backgroundImage: `url(${currentImage})`,
      backgroundSize: `${level * 100}%`,
      backgroundPosition: `${(correctPos % level) * (100 / (level - 1))}% ${(Math.floor(correctPos / level)) * (100 / (level - 1))}%`
    };
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* GAME BOARD */}
        <div className="flex-1 flex flex-col items-center">
            
            {/* Header */}
            <div className="w-full flex justify-between items-end mb-6">
               <div>
                 <h2 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 neon-text">
                   {t.title}
                 </h2>
                 <p className="text-blue-300/70 font-mono text-xs tracking-widest">{t.desc}</p>
               </div>
               <div className="flex gap-4 font-mono text-xl font-bold">
                 <div className="flex items-center gap-2 text-pink-400">
                    <RefreshCw className="w-5 h-5" /> {moves}
                 </div>
                 <div className="flex items-center gap-2 text-yellow-400">
                    <Clock className="w-5 h-5" /> {formatTime(time)}
                 </div>
               </div>
            </div>

            {/* The Grid */}
            <div 
              className="relative w-full max-w-[600px] aspect-square bg-gray-900 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] border-4 border-gray-800"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${level}, 1fr)`,
                gap: isWon ? '0px' : '4px',
                transition: 'gap 0.5s ease-in-out'
              }}
            >
              {/* Overlay when won */}
              {isWon && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-700">
                   <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_30px_gold] animate-bounce mb-4" />
                   <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">{t.win}</h2>
                   <p className="text-gray-300 mb-8 font-mono">{t.winDesc}</p>
                   <button 
                     onClick={() => onComplete(Math.max(50, 500 - moves * 2))}
                     className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-full text-xl shadow-lg hover:scale-105 transition-transform"
                   >
                     {t.claim} (+{Math.max(50, 500 - moves * 2)} PTS)
                   </button>
                </div>
              )}
              
              {/* Start Screen Overlay */}
              {!isPlaying && !isWon && (
                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                    <Puzzle className="w-24 h-24 text-blue-500 mb-6 animate-pulse" />
                    <button 
                      onClick={() => startNewGame(level)}
                      className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
                    >
                      {t.newGame}
                    </button>
                 </div>
              )}

              {/* Tiles */}
              {tiles.map((tile, index) => {
                 const isCorrect = tile.correctPos === index;
                 const isSelected = selectedTileIndex === index;
                 
                 return (
                   <div
                     key={tile.id}
                     onClick={() => handleTileClick(index)}
                     className={`relative w-full h-full cursor-pointer transition-all duration-300 overflow-hidden group ${isWon ? 'rounded-none border-0' : 'rounded-lg'}`}
                     style={{
                       ...getTileStyle(index, tile.correctPos),
                       opacity: showPreview ? 0.1 : 1,
                       transform: isSelected ? 'scale(0.95)' : 'scale(1)',
                       zIndex: isSelected ? 10 : 1,
                       boxShadow: isSelected ? '0 0 20px #ec4899' : 'none',
                       border: isSelected ? '2px solid #ec4899' : isCorrect && !isWon ? '2px solid #10b981' : 'none'
                     }}
                   >
                     {/* Tile Number Hint (Optional, visible on hover) */}
                     {!isWon && (
                       <div className="absolute top-1 left-1 text-[10px] font-mono font-bold text-white/50 bg-black/50 px-1 rounded opacity-0 group-hover:opacity-100">
                         {tile.correctPos + 1}
                       </div>
                     )}
                     
                     {/* Correct Indicator */}
                     {isCorrect && !isWon && (
                       <div className="absolute inset-0 border-2 border-green-500/50 rounded-lg pointer-events-none"></div>
                     )}
                   </div>
                 );
              })}
              
              {/* Original Image Preview Overlay */}
              {showPreview && (
                 <img src={currentImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-40 pointer-events-none" />
              )}
            </div>
        </div>

        {/* SIDEBAR CONTROLS */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
           
           {/* Difficulty */}
           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-gray-400 font-bold mb-4 uppercase text-sm tracking-wider">Difficulty</h3>
              <div className="flex flex-col gap-2">
                 {[
                    { size: 3, label: t.easy, color: 'text-green-400 border-green-500/30 bg-green-500/10' },
                    { size: 4, label: t.medium, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
                    { size: 5, label: t.hard, color: 'text-red-400 border-red-500/30 bg-red-500/10' }
                 ].map((lvl) => (
                    <button
                       key={lvl.size}
                       onClick={() => startNewGame(lvl.size as any)}
                       className={`py-3 px-4 rounded-xl border text-left font-mono font-bold transition-all ${level === lvl.size ? lvl.color + ' shadow-lg scale-[1.02]' : 'border-gray-800 text-gray-500 hover:bg-gray-800'}`}
                    >
                       {lvl.label}
                    </button>
                 ))}
              </div>
           </div>

           {/* Actions */}
           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <button 
                 onMouseDown={() => setShowPreview(true)}
                 onMouseUp={() => setShowPreview(false)}
                 onMouseLeave={() => setShowPreview(false)}
                 className="w-full py-3 rounded-xl bg-gray-800 text-gray-200 font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                 <ImageIcon className="w-5 h-5" /> {t.preview} (Hold)
              </button>
              
              <button 
                 onClick={() => startNewGame(level)}
                 className="w-full py-3 rounded-xl border border-purple-500/50 text-purple-400 font-bold hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2"
              >
                 <RefreshCw className="w-5 h-5" /> {t.newGame}
              </button>
           </div>

           {/* Mini Status */}
           <div className="bg-black/40 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                 <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                 <span className="text-xs text-gray-500 uppercase tracking-widest">Game Status</span>
              </div>
              <div className="text-xl font-bold text-white">
                 {isWon ? 'COMPLETED' : isPlaying ? 'IN PROGRESS' : 'IDLE'}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;
