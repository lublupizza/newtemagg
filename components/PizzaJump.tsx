
import React, { useRef, useEffect, useState } from 'react';
import { Language } from '../types';
import { Trophy, Play, RotateCcw, Zap, Keyboard, Shield, Magnet, Skull, Coffee, Rocket, Heart } from 'lucide-react';

interface PizzaJumpProps {
  onGameOver: (score: number) => void;
  language: Language;
  autoStart?: boolean;
}

// ... (Keep Config and Interfaces) ...
// --- CONFIG ---
const GRAVITY = 0.5; // Reduced slightly for easier float
const JUMP_FORCE = -15;
const SPRING_FORCE = -22;
const JETPACK_FORCE = -12; // Constant upward force
const ACCELERATION = 1.5; // Snappier control
const MAX_SPEED = 12;
const FRICTION = 0.88;
const PLATFORM_WIDTH_BASE = 90; // Wider platforms
const PLATFORM_HEIGHT = 20;
const TIME_SCALE_SLOW = 0.5;

interface GameObject {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  type: 'player' | 'platform' | 'item' | 'particle' | 'cloud' | 'star' | 'enemy' | 'plane';
  subtype?: 'normal' | 'moving' | 'break' | 'spring' | 'sauce' | 'coin' | 'shield' | 'magnet' | 'coffee' | 'drone' | 'bird' | 'jetpack';
  active: boolean;
  color?: string;
  rotation?: number;
  opacity?: number;
  initialY?: number;
  phase?: number;
}

const PizzaJump: React.FC<PizzaJumpProps> = ({ onGameOver, language, autoStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null); 
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [finalScore, setFinalScore] = useState(0);

  // ... (Keep gameRef) ...
  const gameRef = useRef({
    player: { x: 0, y: 0, w: 40, h: 60, vx: 0, vy: 0, faceRight: true } as any,
    platforms: [] as GameObject[],
    items: [] as GameObject[],
    enemies: [] as GameObject[],
    particles: [] as GameObject[],
    clouds: [] as GameObject[],
    stars: [] as GameObject[],
    planes: [] as GameObject[], // New: Planes
    keys: { left: false, right: false },
    cameraY: 0,
    score: 0,
    width: 0,
    height: 0,
    isBoosting: false, // Sauce boost
    hasJetpack: false, // New: Jetpack state
    jetpackTimer: 0,
    hasShield: false,
    hasMagnet: false,
    magnetTimer: 0,
    isMatrixMode: false,
    matrixTimer: 0,
    timeScale: 1.0,
    loopId: 0,
    planeTimer: 0
  });

  const t = {
    title: language === 'ru' ? 'КУРЬЕР ДЖАМП' : 'DELIVERY JUMP',
    desc: language === 'ru' ? 'Доставь пиццу в космос!' : 'Deliver pizza to space!',
    start: language === 'ru' ? 'ПОЛЕТЕЛИ!' : 'JUMP!',
    score: language === 'ru' ? 'ВЫСОТА' : 'HEIGHT',
    gameOver: language === 'ru' ? 'УПАЛ!' : 'FELL DOWN!',
    restart: language === 'ru' ? 'ЗАНОВО' : 'RESTART',
    boost: language === 'ru' ? 'ТУРБО!' : 'TURBO!',
    shield: language === 'ru' ? 'ЩИТ!' : 'SHIELD!',
    jetpack: language === 'ru' ? 'ДЖЕТПАК!' : 'JETPACK!',
    magnet: language === 'ru' ? 'МАГНИТ!' : 'MAGNET!',
    matrix: language === 'ru' ? 'МАТРИЦА!' : 'MATRIX!',
    controls: language === 'ru' ? 'Управление: Стрелки / A-D' : 'Controls: Arrows / A-D'
  };

  const generatePlatformType = (difficulty: number): { subtype: any, w: number, h: number, vx: number } => {
      const typeRoll = Math.random();
      let subtype: 'normal' | 'moving' | 'break' | 'spring' = 'normal';
      let vx = 0;
      
      // Reduced moving platform chance for easier difficulty
      if (typeRoll < 0.20) { 
          subtype = 'moving';
          vx = Math.random() > 0.5 ? 2 : -2;
      }
      else if (typeRoll < 0.35) subtype = 'break';
      else if (Math.random() < 0.15) subtype = 'spring'; // Increased springs

      // Wider platforms, shrinking slower
      const pWidth = Math.max(60, PLATFORM_WIDTH_BASE - difficulty * 10); 
      const pHeight = PLATFORM_HEIGHT;

      return { subtype, w: pWidth, h: pHeight, vx };
  };

  const initGame = () => {
    const g = gameRef.current;
    if (!canvasRef.current) return;
    
    const parent = canvasRef.current.parentElement;
    const width = parent ? parent.clientWidth : 600;
    const height = 600;
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    g.width = width;
    g.height = height;
    g.score = 0;
    g.cameraY = 0;
    g.isBoosting = false;
    g.hasJetpack = false;
    g.jetpackTimer = 0;
    g.hasShield = false;
    g.hasMagnet = false;
    g.isMatrixMode = false;
    g.timeScale = 1.0;
    g.keys = { left: false, right: false };
    g.planeTimer = 200; // Start plane timer

    // Reset Player
    g.player = {
      x: width / 2 - 20,
      y: height - 150,
      w: 40,
      h: 60,
      vx: 0,
      vy: JUMP_FORCE,
      faceRight: true,
      active: true,
      type: 'player'
    };

    // Initial Platforms
    g.platforms = [];
    g.platforms.push({ x: 0, y: height - 20, w: width, h: 20, vx: 0, vy: 0, type: 'platform', subtype: 'normal', active: true });
    
    // Generate initial set (Very dense)
    for (let i = 0; i < height - 100; i += 60) {
       const isSafeZone = i > height - 300;
       const { subtype, w, h, vx } = isSafeZone 
            ? { subtype: 'normal', w: 120, h: 20, vx: 0 } 
            : generatePlatformType(0);

       g.platforms.push({
           x: Math.random() * (width - w),
           y: i,
           w: w,
           h: h,
           vx: vx,
           vy: 0,
           type: 'platform',
           subtype: subtype as any,
           active: true
       });
    }

    // Background Elements
    g.clouds = Array.from({ length: 8 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        w: 100 + Math.random() * 100,
        h: 40 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.2,
        vy: 0,
        type: 'cloud',
        active: true,
        opacity: 0.3 + Math.random() * 0.4
    }));

    g.stars = Array.from({ length: 60 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height - height, 
        w: 2 + Math.random() * 2,
        h: 2 + Math.random() * 2,
        vx: 0, vy: 0, type: 'star', active: true, opacity: Math.random()
    }));

    g.items = [];
    g.enemies = [];
    g.particles = [];
    g.planes = [];
    
    if (scoreElRef.current) scoreElRef.current.innerText = "0";
  };

  // --- GAME LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = 600;
            gameRef.current.width = canvas.width;
            gameRef.current.height = canvas.height;
        }
    };
    window.addEventListener('resize', resize);
    resize();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') gameRef.current.keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd') gameRef.current.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') gameRef.current.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd') gameRef.current.keys.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ... (Keep Helper Functions like spawnPlatform, spawnPlane) ...
    const spawnPlatform = (y: number) => {
        const g = gameRef.current;
        const difficulty = Math.min(g.score / 20000, 1); // Slower difficulty ramp
        
        const { subtype, w, h, vx } = generatePlatformType(difficulty);

        g.platforms.push({
            x: Math.random() * (g.width - w),
            y: y,
            w: w,
            h: h,
            vx: vx,
            vy: 0,
            type: 'platform',
            subtype: subtype as any,
            active: true
        });

        // Spawn Items (Higher chance)
        if (Math.random() < 0.3) {
            const r = Math.random();
            let itemType: 'jetpack' | 'sauce' | 'coin' | 'shield' | 'magnet' | 'coffee' = 'coin';
            
            if (r < 0.08) itemType = 'jetpack'; // 8% Chance
            else if (r < 0.15) itemType = 'sauce';
            else if (r < 0.25) itemType = 'shield';
            else if (r < 0.35) itemType = 'magnet';
            else if (r < 0.45) itemType = 'coffee'; 
            
            g.items.push({
                x: Math.random() * (g.width - 30),
                y: y - 40,
                w: 30,
                h: 30,
                vx: 0,
                vy: 0,
                type: 'item',
                subtype: itemType,
                active: true,
                rotation: 0
            });
        }

        // Spawn Enemies (Less frequent)
        if (g.score > 500 && Math.random() < 0.15) {
             const isBird = Math.random() > 0.5;
             g.enemies.push({
                x: Math.random() * g.width,
                y: y - 80,
                w: 40,
                h: 30,
                vx: Math.random() > 0.5 ? 2 : -2,
                vy: 0,
                type: 'enemy',
                subtype: isBird ? 'bird' : 'drone',
                active: true,
                initialY: y - 80,
                phase: Math.random() * Math.PI * 2
             });
        }
    };

    const spawnPlane = () => {
        const g = gameRef.current;
        const startLeft = Math.random() > 0.5;
        g.planes.push({
            x: startLeft ? -300 : g.width + 300,
            y: Math.random() * (g.height * 0.5), // Upper half
            w: 200, // Banner width approx
            h: 40,
            vx: startLeft ? 3 : -3,
            vy: 0,
            type: 'plane',
            active: true,
            rotation: 0 // 0 = left->right, 1 = right->left
        });
    };

    const loop = () => {
        if (gameState !== 'playing') return;
        const g = gameRef.current;

        // MATRIX MODE LOGIC
        if (g.isMatrixMode) {
            g.timeScale = TIME_SCALE_SLOW;
            g.matrixTimer--;
            if (g.matrixTimer <= 0) g.isMatrixMode = false;
        } else {
            g.timeScale = 1.0;
        }

        // PLANES LOGIC
        g.planeTimer--;
        if (g.planeTimer <= 0) {
            spawnPlane();
            g.planeTimer = 800 + Math.random() * 500; // Every 15-20s approx
        }
        g.planes.forEach(p => {
            p.x += p.vx;
            if (p.x > g.width + 400 || p.x < -400) p.active = false;
        });
        g.planes = g.planes.filter(p => p.active);

        // --- PHYSICS ---
        
        if (g.keys.left) g.player.vx -= ACCELERATION;
        if (g.keys.right) g.player.vx += ACCELERATION;
        
        g.player.vx *= FRICTION;
        g.player.vx = Math.max(Math.min(g.player.vx, MAX_SPEED), -MAX_SPEED);

        g.player.x += g.player.vx; 
        if (g.player.vx > 0.5) g.player.faceRight = true;
        if (g.player.vx < -0.5) g.player.faceRight = false;

        // Timers
        if (g.hasMagnet) {
            g.magnetTimer--;
            if (g.magnetTimer <= 0) g.hasMagnet = false;
        }

        // JETPACK LOGIC
        if (g.hasJetpack) {
            g.player.vy = JETPACK_FORCE;
            g.jetpackTimer--;
            if (g.jetpackTimer <= 0) g.hasJetpack = false;
            
            // Jetpack flames
            for(let k=0; k<2; k++) {
                g.particles.push({
                    x: g.player.x + (g.player.faceRight ? 0 : g.player.w),
                    y: g.player.y + g.player.h * 0.8,
                    w: Math.random() * 6 + 4, h: Math.random() * 6 + 4,
                    vx: (Math.random() - 0.5) * 2, vy: Math.random() * 5 + 2,
                    type: 'particle', active: true, color: Math.random() > 0.5 ? '#ef4444' : '#f59e0b'
                });
            }
        } 
        // NORMAL GRAVITY
        else {
            g.player.vy += GRAVITY * (g.isMatrixMode ? 0.5 : 1);
        }
        
        g.player.y += g.player.vy * (g.isMatrixMode && g.player.vy > 0 ? 0.5 : 1);

        if (g.player.x > g.width) g.player.x = -g.player.w;
        if (g.player.x + g.player.w < 0) g.player.x = g.width;

        // Camera Follow
        if (g.player.y < g.height * 0.45) {
            const diff = (g.height * 0.45 - g.player.y); 
            g.player.y += diff;
            g.score += diff;
            
            if (scoreElRef.current) {
                scoreElRef.current.innerText = Math.floor(g.score).toString();
            }

            const moveObj = (obj: GameObject) => {
                obj.y += diff;
                if (obj.y > g.height) obj.active = false;
            };

            g.platforms.forEach(p => {
                p.y += diff;
                if (p.y > g.height) {
                    p.active = false;
                    const difficulty = Math.min(g.score / 20000, 1); 
                    const baseGap = 40; // Closer gap
                    const gap = baseGap + (80 * difficulty) + (Math.random() * 20);
                    spawnPlatform(p.y - g.height - gap); 
                }
            });
            g.items.forEach(moveObj);
            g.enemies.forEach(moveObj);
            g.clouds.forEach(c => {
                c.y += diff * 0.6;
                if (c.y > g.height) { c.y = -c.h; c.x = Math.random() * g.width; }
            });
            g.stars.forEach(s => {
                s.y += diff * 0.2;
                if (s.y > g.height) { s.y = -s.h; s.x = Math.random() * g.width; }
            });
        }

        g.platforms = g.platforms.filter(p => p.active);
        g.items = g.items.filter(i => i.active);
        g.particles = g.particles.filter(p => p.active);
        g.enemies = g.enemies.filter(e => e.active);

        // Collision
        if (g.player.vy > 0 && !g.hasJetpack) { 
            g.platforms.forEach(p => {
                if (
                    g.player.x + g.player.w * 0.8 > p.x &&
                    g.player.x + g.player.w * 0.2 < p.x + p.w &&
                    g.player.y + g.player.h > p.y &&
                    g.player.y + g.player.h < p.y + p.h + g.player.vy + 15
                ) {
                    if (p.subtype === 'break') {
                        p.active = false;
                        g.player.vy = JUMP_FORCE * 0.5;
                        for(let k=0; k<5; k++) {
                            g.particles.push({
                                x: p.x + p.w/2, y: p.y, w: 8, h: 8, vx: (Math.random()-0.5)*5, vy: -Math.random()*5,
                                type: 'particle', active: true, color: '#a16207'
                            });
                        }
                    } else if (p.subtype === 'spring') {
                        g.player.vy = SPRING_FORCE;
                    } else {
                        g.player.vy = JUMP_FORCE;
                    }
                }
            });
        }

        // Object Movement
        g.platforms.forEach(p => {
            if (p.subtype === 'moving') {
                p.x += p.vx * g.timeScale;
                if (p.x < 0 || p.x + p.w > g.width) p.vx *= -1;
            }
        });

        g.enemies.forEach(e => {
            e.x += e.vx * g.timeScale;
            if (e.x < 0 || e.x + e.w > g.width) e.vx *= -1;
            if (e.subtype === 'bird' && e.initialY) {
                e.phase = (e.phase || 0) + 0.1 * g.timeScale;
                e.y = e.initialY + Math.sin(e.phase) * 50;
            }
            
            if (!g.hasJetpack && !g.hasShield) {
                if (
                    g.player.x < e.x + e.w && g.player.x + g.player.w > e.x &&
                    g.player.y < e.y + e.h && g.player.y + g.player.h > e.y
                ) {
                    if (g.player.vy > 0 && g.player.y + g.player.h < e.y + 20) {
                        e.active = false; g.score += 1000; g.player.vy = JUMP_FORCE;
                    } else {
                        g.player.vy = 0; setFinalScore(Math.floor(g.score)); setGameState('gameover'); onGameOver(Math.floor(g.score / 10));
                    }
                }
            }
        });

        g.items.forEach(item => {
            if (g.hasMagnet && item.subtype === 'coin') {
                const dx = (g.player.x + g.player.w/2) - (item.x + item.w/2);
                const dy = (g.player.y + g.player.h/2) - (item.y + item.h/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 400) { item.x += dx * 0.15; item.y += dy * 0.15; }
            }
            if (
                g.player.x < item.x + item.w && g.player.x + g.player.w > item.x &&
                g.player.y < item.y + item.h && g.player.y + g.player.h > item.y
            ) {
                item.active = false;
                if (item.subtype === 'jetpack') { g.hasJetpack = true; g.jetpackTimer = 300; }
                else if (item.subtype === 'sauce') { g.player.vy = -25; } 
                else if (item.subtype === 'shield') { g.hasShield = true; } 
                else if (item.subtype === 'magnet') { g.hasMagnet = true; g.magnetTimer = 600; }
                else if (item.subtype === 'coffee') { g.isMatrixMode = true; g.matrixTimer = 400; }
                else if (item.subtype === 'coin') { g.score += 500; }
            }
            item.rotation = (item.rotation || 0) + 0.05;
        });

        g.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.w *= 0.95; p.h *= 0.95;
            if (p.w < 0.5) p.active = false;
        });

        if (g.player.y > g.height) {
            setFinalScore(Math.floor(g.score)); setGameState('gameover'); onGameOver(Math.floor(g.score / 10));
        }

        // --- RENDER ---
        const maxSpaceHeight = 20000;
        const ratio = Math.min(g.score / maxSpaceHeight, 1);
        let r, gx, b;
        if (ratio < 0.3) { 
            const t = ratio / 0.3; r = Math.round(135 * (1-t) + 253 * t); gx = Math.round(206 * (1-t) + 186 * t); b = Math.round(235 * (1-t) + 116 * t);
        } else if (ratio < 0.6) { 
            const t = (ratio - 0.3) / 0.3; r = Math.round(253 * (1-t) + 49 * t); gx = Math.round(186 * (1-t) + 46 * t); b = Math.round(116 * (1-t) + 129 * t);
        } else {
            const t = (ratio - 0.6) / 0.4; r = Math.round(49 * (1-t) + 0 * t); gx = Math.round(46 * (1-t) + 0 * t); b = Math.round(129 * (1-t) + 0 * t);
        }
        
        ctx.fillStyle = `rgb(${r},${gx},${b})`;
        ctx.fillRect(0, 0, g.width, g.height);

        if (ratio > 0.3) {
            ctx.globalAlpha = (ratio - 0.3) * 1.5;
            g.stars.forEach(s => { ctx.fillStyle = 'white'; ctx.fillRect(s.x, s.y, s.w, s.h); });
            ctx.globalAlpha = 1;
        }

        // RENDER PLANES (CORN DUSTER / BIPLANE STYLE)
        g.planes.forEach(plane => {
            ctx.save();
            ctx.translate(plane.x, plane.y);
            if (plane.vx < 0) ctx.scale(-1, 1); // Flip if moving left
            
            // Scale plane slightly for visibility
            const s = 1.2;
            ctx.scale(s, s);

            // 1. Bottom Wing
            ctx.fillStyle = '#facc15'; // Yellow-400
            ctx.fillRect(-25, 8, 70, 6);
            
            // 2. Fuselage (Body) - Red
            ctx.fillStyle = '#dc2626'; // Red-600
            ctx.beginPath();
            ctx.moveTo(40, -2); // Nose top
            ctx.lineTo(40, 12); // Nose bottom
            ctx.lineTo(-35, 10); // Tail bottom
            ctx.lineTo(-35, 0); // Tail top
            ctx.closePath();
            ctx.fill();

            // 3. Top Wing
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-25, -15, 70, 6);

            // 4. Wing Struts (Vertical bars)
            ctx.fillStyle = '#78350f'; // Brown
            ctx.fillRect(-10, -15, 4, 25); // Back strut
            ctx.fillRect(25, -15, 4, 25); // Front strut

            // 5. Tail
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.moveTo(-35, 2);
            ctx.lineTo(-50, -12); // Top stabilizer
            ctx.lineTo(-50, 5);
            ctx.lineTo(-35, 10);
            ctx.fill();

            // 6. Propeller (Spinning)
            ctx.save();
            ctx.translate(40, 5);
            ctx.rotate(Date.now() / 30);
            ctx.fillStyle = '#d4d4d8'; // Gray
            ctx.fillRect(-2, -30, 4, 60); // Blade
            ctx.restore();

            // 7. Cockpit Bubble
            ctx.fillStyle = '#93c5fd'; // Light Blue
            ctx.beginPath();
            ctx.arc(0, -2, 8, Math.PI, 0);
            ctx.fill();

            // 8. Wheels
            ctx.fillStyle = '#18181b';
            ctx.beginPath(); 
            ctx.arc(15, 18, 5, 0, Math.PI*2); 
            ctx.fill();

            // --- BANNER ---
            // Reset scale for banner string to be sharp
            ctx.scale(1/s, 1/s);
            
            // Banner String attached to tail
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            // Tail position adjusted for scale: (-50 * 1.2) = -60
            ctx.moveTo(-60 * s, 0); 
            ctx.lineTo(-100 * s, 0);
            ctx.stroke();

            // Banner Body
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 10;
            // Start X: -100 * s
            const startX = -100 * s - 200; // 200 is banner width
            ctx.fillRect(startX, -25, 200, 50);
            
            // Banner Border
            ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 3;
            ctx.strokeRect(startX, -25, 200, 50);
            ctx.shadowBlur = 0;

            // Banner Text (Handle Flip)
            if (plane.vx < 0) {
                ctx.save();
                // Center of banner relative to plane origin
                const centerX = startX + 100;
                ctx.translate(centerX, 0); 
                ctx.scale(-1, 1); // Unflip text
                ctx.translate(-centerX, 0);
            }

            ctx.fillStyle = '#dc2626';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Text pos
            const textX = startX + 100;
            ctx.fillText("Люблю Pizza", textX - 15, 0);
            
            // Heart Icon on Banner
            ctx.beginPath();
            ctx.arc(textX + 65, 0, 10, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText('❤', textX + 65, 1);

            if (plane.vx < 0) ctx.restore();

            ctx.restore();
        });

        // CLOUDS
        if (ratio < 0.8) {
            ctx.globalAlpha = 1 - ratio;
            g.clouds.forEach(c => {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.beginPath(); ctx.arc(c.x, c.y, c.w/2, 0, Math.PI*2); ctx.arc(c.x + c.w*0.5, c.y - c.h*0.2, c.w*0.6, 0, Math.PI*2); ctx.arc(c.x - c.w*0.5, c.y - c.h*0.1, c.w*0.4, 0, Math.PI*2); ctx.fill();
            });
            ctx.globalAlpha = 1;
        }

        g.platforms.forEach(p => {
            ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
            if (p.subtype === 'break') {
                ctx.fillStyle = '#78350f'; ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x + 10, p.y); ctx.lineTo(p.x + p.w - 10, p.y + p.h); ctx.moveTo(p.x + p.w - 20, p.y); ctx.lineTo(p.x + 20, p.y + p.h); ctx.stroke();
            } else {
                ctx.fillStyle = '#fef3c7'; ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = '#ef4444'; ctx.fillRect(p.x, p.y + 15, p.w, 5);
                if (p.subtype === 'spring') { ctx.fillStyle = '#4ade80'; ctx.fillRect(p.x + p.w/2 - 10, p.y - 10, 20, 10); }
            }
            ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        });

        g.items.forEach(item => {
            ctx.save(); ctx.translate(item.x + item.w/2, item.y + item.h/2); ctx.rotate(Math.sin(Date.now() / 200) * 0.2);
            if (item.subtype === 'coffee') {
                ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('☕', 0, 2);
            } else if (item.subtype === 'sauce') {
                ctx.fillStyle = '#ef4444'; ctx.fillRect(-6, -12, 12, 24); ctx.fillStyle = '#16a34a'; ctx.fillRect(-6, -14, 12, 4); ctx.fillStyle = 'white'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.fillText('HOT', 0, 5);
            } else if (item.subtype === 'shield') {
                ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0,0, 15, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'white'; ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🛡️', 0, 0);
            } else if (item.subtype === 'jetpack') {
                ctx.fillStyle = '#9ca3af'; ctx.fillRect(-10, -15, 20, 30); ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(-5, 15); ctx.lineTo(0, 25); ctx.lineTo(5, 15); ctx.fill();
                ctx.fillStyle = 'white'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.fillText('🚀', 0, 0);
            } else if (item.subtype === 'magnet') {
                ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.arc(0,0, 15, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'white'; ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🧲', 0, 0);
            } else {
                ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#d97706'; ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 2);
            }
            ctx.restore();
        });

        g.enemies.forEach(e => {
            ctx.save(); ctx.translate(e.x + e.w/2, e.y + e.h/2);
            if (e.subtype === 'bird') {
                ctx.fillStyle = '#06b6d4'; const flap = Math.sin(Date.now() / 50) * 10; ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(-25, -10 + flap); ctx.lineTo(-5, -5); ctx.moveTo(15, 0); ctx.lineTo(25, -10 + flap); ctx.lineTo(5, -5); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(8, -2, 3, 0, Math.PI*2); ctx.fill();
            } else {
                ctx.fillStyle = '#4b5563'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = 'red'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0,0, 5, 0, Math.PI*2); ctx.stroke(); ctx.fillStyle = '#9ca3af'; ctx.fillRect(-20, -2, 15, 4); ctx.fillRect(5, -2, 15, 4);
            }
            ctx.restore();
        });

        const p = g.player;
        ctx.save(); ctx.translate(p.x + p.w/2, p.y + p.h/2);
        if (!p.faceRight) ctx.scale(-1, 1);
        if (g.hasShield) { ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI*2); ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; ctx.fill(); ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'; ctx.lineWidth = 2; ctx.stroke(); }
        if (g.isMatrixMode) { ctx.shadowColor = '#00ff00'; ctx.shadowBlur = 20; }
        
        // Player Body
        ctx.fillStyle = '#2563eb'; ctx.fillRect(-10, -15, 20, 30); 
        ctx.fillStyle = '#fca5a5'; ctx.beginPath(); ctx.arc(0, -20, 10, 0, Math.PI*2); ctx.fill(); 
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -5, 6, 0, Math.PI * 2); ctx.fill(); 
        ctx.fillStyle = '#dc2626'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('♥', 0, -4); 
        ctx.fillStyle = '#dc2626'; ctx.fillRect(-12, -30, 24, 8); 
        
        // Jetpack Graphic on Player
        if (g.hasJetpack) {
            ctx.fillStyle = '#9ca3af';
            ctx.fillRect(-15, -15, 10, 30); // Pack
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.moveTo(-10, 15); ctx.lineTo(-15, 30 + Math.random()*10); ctx.lineTo(-5, 30 + Math.random()*10); ctx.fill();
        } else {
            // Normal Backpack
            ctx.fillStyle = '#fbbf24'; ctx.fillRect(-18, -10, 8, 20); 
        }

        ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 4; ctx.beginPath(); if (p.vy < 0) { ctx.moveTo(-5, 15); ctx.lineTo(-5, 25); ctx.moveTo(5, 15); ctx.lineTo(5, 20); } else { ctx.moveTo(-5, 15); ctx.lineTo(-8, 25); ctx.moveTo(5, 15); ctx.lineTo(8, 25); } ctx.stroke();
        
        ctx.restore();

        g.particles.forEach(pt => { ctx.fillStyle = pt.color || '#fff'; ctx.fillRect(pt.x, pt.y, pt.w, pt.h); });

        gameRef.current.loopId = requestAnimationFrame(loop);
    };

    if (gameState === 'playing') {
        initGame();
        gameRef.current.loopId = requestAnimationFrame(loop);
    }

    return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        cancelAnimationFrame(gameRef.current.loopId);
    };
  }, [gameState]);

  // Auto Start Logic
  useEffect(() => {
      if (autoStart && gameState === 'start') {
          setGameState('playing');
      }
  }, [autoStart]);

  return (
    <div className="w-full h-[600px] relative bg-gray-900 rounded-3xl overflow-hidden border-4 border-blue-500 shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />
        
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 items-start">
            {/* Row 1: Score & Banner */}
            <div className="flex items-center gap-3">
                <div className="bg-white/90 px-4 py-2 rounded-full border border-blue-200 shadow-md flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span ref={scoreElRef} className="font-black text-xl text-blue-600 font-mono">0</span>
                </div>

                {/* Static Banner */}
                <div className="bg-white/90 px-3 py-2 rounded-full border border-red-100 shadow-md flex items-center gap-2 transform hover:scale-105 transition-transform">
                    <div className="w-5 h-5 bg-white flex items-center justify-center rounded-sm shadow-sm border border-gray-100">
                        <Heart className="w-3 h-3 text-red-600 fill-red-600" />
                    </div>
                    <span className="text-[10px] font-black text-gray-800 tracking-widest uppercase">
                        Люблю<span className="text-red-500">Pizza</span>
                    </span>
                </div>
            </div>
        </div>

        <div className="absolute top-24 left-4 flex flex-col gap-2 z-10">
             {gameRef.current.hasJetpack && <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow animate-pulse"><Rocket className="w-3 h-3" /> {t.jetpack}</div>}
             {gameRef.current.hasShield && <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow"><Shield className="w-3 h-3" /> {t.shield}</div>}
             {gameRef.current.hasMagnet && <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow"><Magnet className="w-3 h-3" /> {t.magnet}</div>}
             {gameRef.current.isMatrixMode && <div className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow border border-green-300"><Coffee className="w-3 h-3" /> {t.matrix}</div>}
        </div>

        {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in zoom-in">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                    <Zap className="w-20 h-20 text-yellow-400 relative z-10 mb-6 drop-shadow-[0_0_20px_gold]" />
                </div>
                <h1 className="text-6xl font-black text-white italic mb-4 tracking-tighter text-center">{t.title}</h1>
                <p className="text-blue-200 font-mono mb-10 uppercase tracking-widest text-center max-w-md">{t.desc}</p>
                <button onClick={() => setGameState('playing')} className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-2xl rounded-full hover:scale-110 transition-all shadow-[0_0_40px_rgba(37,99,235,0.5)] flex items-center gap-3">
                    <Play className="fill-current w-6 h-6" /> {t.start}
                </button>
            </div>
        )}

        {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-red-900/90 backdrop-blur-md flex flex-col items-center justify-center z-20 text-white animate-in fade-in">
                <Skull className="w-24 h-24 text-white mb-6 animate-bounce" />
                <h2 className="text-5xl font-black text-white mb-2">{t.gameOver}</h2>
                <div className="text-center mb-10">
                    <div className="text-sm text-red-200 uppercase tracking-widest mb-1">{t.score}</div>
                    <div className="text-7xl font-mono font-black text-yellow-400 drop-shadow-lg">{finalScore}</div>
                </div>
                <button onClick={() => setGameState('playing')} className="px-10 py-4 bg-white text-red-900 font-black text-xl rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-xl">
                    <RotateCcw className="w-6 h-6" /> {t.restart}
                </button>
            </div>
        )}
    </div>
  );
};

export default PizzaJump;
