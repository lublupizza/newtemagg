
import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';
import { Trophy, Maximize2, Minimize2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Heart } from 'lucide-react';

interface PizzaSnakeProps {
  onGameOver: (score: number) => void;
  language: Language;
  autoStart?: boolean;
}

const PizzaSnake: React.FC<PizzaSnakeProps> = ({ onGameOver, language, autoStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [level, setLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ... (Keep gameRef and Translations) ...
  // Game State Refs (mutable without re-render)
  const gameRef = useRef({
    score: 0,
    bonus: 0,
    level: 1,
    speed: 110,
    lastTime: 0,
    snake: [] as {x: number, y: number}[],
    dir: {x: 1, y: 0},
    nextDir: {x: 1, y: 0},
    pizzas: [] as any[],
    enemies: [] as any[],
    snakeSize: 1,
    loopId: 0
  });

  const t = {
    start: language === 'ru' ? 'НАЧАТЬ ИГРУ' : 'START GAME',
    gameOver: language === 'ru' ? 'ИГРА ОКОНЧЕНА' : 'GAME OVER',
    score: language === 'ru' ? 'СЧЕТ' : 'SCORE',
    bonus: language === 'ru' ? 'БОНУС' : 'BONUS',
    restart: language === 'ru' ? 'ИГРАТЬ СНОВА' : 'PLAY AGAIN',
    claim: language === 'ru' ? 'ЗАБРАТЬ' : 'CLAIM'
  };

  // Auto Start Logic
  useEffect(() => {
      if (autoStart && gameState === 'start') {
          setGameState('playing');
      }
  }, [autoStart]);

  // --- ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const GRID = 18;
    let COLS = Math.floor(canvas.width / GRID);
    let ROWS = Math.floor(canvas.height / GRID);

    const resize = () => {
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            COLS = Math.floor(canvas.width / GRID);
            ROWS = Math.floor(canvas.height / GRID);
        }
    };
    resize();
    window.addEventListener('resize', resize);

    // Assets
    const pizzaColors = [
      {color:'#ff6b00',bonus:1}, {color:'#ff8c00',bonus:2}, 
      {color:'#ffa500',bonus:3}, {color:'#ffb347',bonus:4}, {color:'#ffd700',bonus:5}
    ];

    const spawnPizza = () => {
        const g = gameRef.current;
        let placed = false;
        let attempts = 0;
        while(!placed && attempts < 50) {
            const x = Math.floor(Math.random() * COLS);
            const y = Math.floor(Math.random() * ROWS);
            // Simple collision check
            if (!g.snake.some(s => s.x === x && s.y === y)) {
                const type = pizzaColors[Math.floor(Math.random() * pizzaColors.length)];
                g.pizzas.push({x, y, ...type, pulse: 0});
                placed = true;
            }
            attempts++;
        }
    };

    const spawnEnemy = () => {
        const g = gameRef.current;
        const x = Math.floor(Math.random() * COLS);
        const y = Math.floor(Math.random() * ROWS);
        const types = ['dodo', 'ninja', 'firebird'];
        g.enemies.push({
            x, y,
            vx: (Math.random()-0.5)*0.5,
            vy: (Math.random()-0.5)*0.5,
            type: types[Math.floor(Math.random() * types.length)],
            angle: 0
        });
    };

    const resetGame = () => {
        resize();
        const g = gameRef.current;
        g.score = 0;
        g.bonus = 0;
        g.level = 1;
        g.speed = 110;
        g.snake = [
            {x: Math.floor(COLS/2), y: Math.floor(ROWS/2)},
            {x: Math.floor(COLS/2)-1, y: Math.floor(ROWS/2)},
            {x: Math.floor(COLS/2)-2, y: Math.floor(ROWS/2)}
        ];
        g.dir = {x: 1, y: 0};
        g.nextDir = {x: 1, y: 0};
        g.pizzas = [];
        g.enemies = [];
        g.snakeSize = 1;
        
        spawnPizza();
        spawnPizza();
        spawnPizza();
        setScore(0);
        setBonus(0);
        setLevel(1);
    };

    // Game Loop
    const loop = (time: number) => {
        const g = gameRef.current;
        if (gameState !== 'playing') return;

        if (time - g.lastTime > g.speed) {
            update();
            g.lastTime = time;
        }
        render();
        g.loopId = requestAnimationFrame(loop);
    };

    const update = () => {
        const g = gameRef.current;
        g.dir = g.nextDir;
        const head = g.snake[0];
        const newHead = {
            x: (head.x + g.dir.x + COLS) % COLS,
            y: (head.y + g.dir.y + ROWS) % ROWS
        };

        // Self Collision
        if (g.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
            endGame();
            return;
        }

        g.snake.unshift(newHead);

        // Eat Pizza
        let ate = false;
        g.pizzas = g.pizzas.filter(p => {
            if (p.x === newHead.x && p.y === newHead.y) {
                g.score += p.bonus * 10;
                g.snakeSize = 1 + (p.bonus * 0.2);
                g.bonus = Math.min(100, g.bonus + p.bonus);
                ate = true;
                setScore(g.score);
                setBonus(g.bonus);
                return false;
            }
            return true;
        });

        if (ate) {
            // Don't pop tail -> grow
            if (g.pizzas.length < 3) spawnPizza();
            g.level = Math.floor(g.bonus / 25) + 1;
            setLevel(g.level);
            // Spawn enemy occasionally
            if (Math.random() < 0.05 * g.level && g.enemies.length < 3) spawnEnemy();
        } else {
            // Move tail
            g.snake.pop();
        }

        // Enemies
        g.enemies.forEach(e => {
            e.x += e.vx;
            e.y += e.vy;
            e.angle += 0.1;
            // Bounce
            if (e.x < 0 || e.x >= COLS) e.vx *= -1;
            if (e.y < 0 || e.y >= ROWS) e.vy *= -1;
            
            // Collision
            if (Math.hypot(newHead.x - e.x, newHead.y - e.y) < 1.5) {
                endGame();
            }
        });
    };

    const endGame = () => {
        setGameState('gameover');
        cancelAnimationFrame(gameRef.current.loopId);
        onGameOver(Math.floor(gameRef.current.score / 10));
    };

    const render = () => {
        if (!ctx || !canvas) return;
        const g = gameRef.current;
        
        // BG
        ctx.fillStyle = 'rgba(0,10,20,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = 'rgba(0,255,0,0.05)';
        ctx.lineWidth = 1;
        for(let i = 0; i < canvas.width; i += GRID) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for(let i = 0; i < canvas.height; i += GRID) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Snake
        g.snake.forEach((s, i) => {
            const x = s.x * GRID + GRID/2;
            const y = s.y * GRID + GRID/2;
            const radius = (GRID/2 - 1) * (i === 0 ? 1.2 : 1);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2);
            if (i === 0) {
                ctx.fillStyle = '#00ff00';
                ctx.shadowBlur = 15; ctx.shadowColor = '#00ff00';
                ctx.fill();
                ctx.shadowBlur = 0;
                // Face
                ctx.fillStyle = 'black';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('❤️', x, y);
            } else {
                ctx.fillStyle = `rgba(0,255,0,${1 - i/g.snake.length})`;
                ctx.fill();
            }
        });

        // Pizza
        g.pizzas.forEach(p => {
            const x = p.x * GRID + GRID/2;
            const y = p.y * GRID + GRID/2;
            p.pulse = (p.pulse + 0.1) % (Math.PI*2);
            const scale = 1 + Math.sin(p.pulse)*0.2;
            
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(x, y, (GRID/2)*scale, 0, Math.PI*2);
            ctx.fill();
            ctx.font = '10px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('🍕', x, y);
        });

        // Enemies
        g.enemies.forEach(e => {
            const x = e.x * GRID + GRID/2;
            const y = e.y * GRID + GRID/2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(e.angle);
            ctx.font = '16px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            if(e.type === 'dodo') ctx.fillText('🐦', 0, 0);
            else if(e.type === 'ninja') ctx.fillText('🥷', 0, 0);
            else ctx.fillText('🐓', 0, 0);
            ctx.restore();
        });
    };

    // Controls
    const handleKeyDown = (e: KeyboardEvent) => {
        const g = gameRef.current;
        if (e.key === 'ArrowUp' && g.dir.y === 0) g.nextDir = {x:0,y:-1};
        if (e.key === 'ArrowDown' && g.dir.y === 0) g.nextDir = {x:0,y:1};
        if (e.key === 'ArrowLeft' && g.dir.x === 0) g.nextDir = {x:-1,y:0};
        if (e.key === 'ArrowRight' && g.dir.x === 0) g.nextDir = {x:1,y:0};
    };
    
    window.addEventListener('keydown', handleKeyDown);

    // Start Loop if playing
    if (gameState === 'playing') {
        resetGame();
        gameRef.current.loopId = requestAnimationFrame(loop);
    }

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(gameRef.current.loopId);
    };
  }, [gameState]);

  // Manual Controls for UI
  const setDir = (x: number, y: number) => {
      const g = gameRef.current;
      if (x !== 0 && g.dir.x === 0) g.nextDir = {x, y:0};
      if (y !== 0 && g.dir.y === 0) g.nextDir = {x:0, y};
  };

  return (
    <div className={`relative bg-black border-4 border-green-500 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.3)] ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-[500px]'}`}>
       <canvas ref={canvasRef} className="w-full h-full block touch-none" />
       
       {/* UI Overlay */}
       <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-10">
           <div className="flex items-center gap-3">
               <div className="bg-green-900/20 px-2 py-1 rounded border border-green-500/30 flex items-center gap-2 text-green-400 font-mono font-bold text-sm w-fit">
                   <Trophy className="w-4 h-4" /> {score}
               </div>
               
               {/* STATIC MINIATURE AD BANNER */}
               <div className="bg-black/60 border border-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,0,0.1)] w-fit opacity-90">
                   <div className="w-3 h-3 bg-white flex items-center justify-center rounded-[2px]">
                       <Heart className="w-2 h-2 text-red-600 fill-red-600" />
                   </div>
                   <span className="text-[9px] text-green-300 font-mono font-bold tracking-widest uppercase">
                       ЛюблюPizza
                   </span>
               </div>
           </div>

           <div className="bg-green-900/20 px-2 py-1 rounded border border-green-500/30 text-green-400 font-mono font-bold text-sm">
               LVL {level}
           </div>
       </div>

       {/* Bonus Bar */}
       <div className="absolute bottom-4 left-4 w-32 pointer-events-none">
           <div className="text-green-500 text-[10px] mb-1 font-mono">BONUS PROGRESS</div>
           <div className="h-2 bg-green-900 rounded-full overflow-hidden border border-green-500/30">
               <div className="h-full bg-green-500 transition-all duration-300" style={{width: `${bonus}%`}}></div>
           </div>
       </div>

       {/* Controls (Mobile) */}
       <div className="absolute bottom-8 right-8 grid grid-cols-3 gap-1 z-20 opacity-50 hover:opacity-100 transition-opacity">
           <div></div>
           <button onPointerDown={() => setDir(0, -1)} className="w-12 h-12 bg-green-900/50 rounded border border-green-500 flex items-center justify-center active:bg-green-500/50"><ArrowUp className="text-green-400"/></button>
           <div></div>
           <button onPointerDown={() => setDir(-1, 0)} className="w-12 h-12 bg-green-900/50 rounded border border-green-500 flex items-center justify-center active:bg-green-500/50"><ArrowLeft className="text-green-400"/></button>
           <button onPointerDown={() => setDir(0, 1)} className="w-12 h-12 bg-green-900/50 rounded border border-green-500 flex items-center justify-center active:bg-green-500/50"><ArrowDown className="text-green-400"/></button>
           <button onPointerDown={() => setDir(1, 0)} className="w-12 h-12 bg-green-900/50 rounded border border-green-500 flex items-center justify-center active:bg-green-500/50"><ArrowRight className="text-green-400"/></button>
       </div>

       {/* Fullscreen Toggle */}
       <button 
         onClick={() => setIsFullscreen(!isFullscreen)}
         className="absolute top-4 right-4 p-2 bg-green-900/30 text-green-400 rounded hover:bg-green-900/50 transition-colors z-30"
       >
         {isFullscreen ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4"/>}
       </button>

       {/* Screens */}
       {gameState === 'start' && (
           <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-green-500 z-40">
               <div className="text-6xl mb-4 animate-bounce">🐍</div>
               <h1 className="text-4xl font-mono font-bold mb-2">PIZZA SNAKE</h1>
               <p className="text-sm font-mono mb-8 opacity-70">RETRO EDITION</p>
               <button onClick={() => setGameState('playing')} className="flex items-center gap-2 px-8 py-3 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors font-mono">
                   <Play className="w-5 h-5" fill="currentColor" /> {t.start}
               </button>
           </div>
       )}

       {gameState === 'gameover' && (
           <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white z-40">
               <h2 className="text-4xl font-black mb-2">{t.gameOver}</h2>
               <div className="text-2xl font-mono text-green-400 mb-8">{t.score}: {score}</div>
               <div className="flex gap-4">
                   <button onClick={() => setGameState('playing')} className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-black font-bold transition-colors">
                       {t.restart}
                   </button>
                   <button onClick={() => onGameOver(Math.floor(score/10))} className="px-6 py-2 bg-green-500 text-black rounded font-bold hover:bg-green-400 transition-colors">
                       {t.claim}
                   </button>
               </div>
           </div>
       )}
    </div>
  );
};

export default PizzaSnake;
