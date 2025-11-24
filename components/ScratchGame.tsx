
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { Ticket, Sparkles, RotateCcw, Gift, Star, PartyPopper } from 'lucide-react';

interface ScratchGameProps {
  language: Language;
  onWin: (prize: string, type: 'bonus' | 'ornament') => void;
}

interface Prize {
  label: { ru: string, en: string };
  icon: React.ReactNode;
  type: 'bonus' | 'ornament';
  id: string;
}

const PRIZES: Prize[] = [
  { id: 'blue_orb', label: { ru: 'Неоновый Шар', en: 'Neon Orb' }, type: 'ornament', icon: <div className="w-20 h-20 rounded-full bg-cyan-400 border-4 border-white shadow-[0_0_30px_cyan] animate-pulse"></div> },
  { id: 'gold_orb', label: { ru: 'Золотой Шар', en: 'Gold Orb' }, type: 'ornament', icon: <div className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-white shadow-[0_0_30px_gold] animate-pulse"></div> },
  { id: 'discount_5', label: { ru: 'Скидка 5%', en: '5% OFF' }, type: 'bonus', icon: <div className="text-6xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] transform rotate-[-5deg]">5%</div> },
  { id: 'points_100', label: { ru: '100 Очков', en: '100 Points' }, type: 'bonus', icon: <div className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_15px_gold] transform rotate-[5deg]">100</div> },
  { id: 'ice_drop', label: { ru: 'Ледяная Сосулька', en: 'Ice Drop' }, type: 'ornament', icon: <span className="text-7xl drop-shadow-[0_0_20px_rgba(165,243,252,0.8)]">💧</span> },
];

const ScratchGame: React.FC<ScratchGameProps> = ({ language, onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const t = {
    title: language === 'ru' ? 'СЧАСТЛИВАЯ КАРТА' : 'LUCKY CARD',
    desc: language === 'ru' ? 'Сотри защитный слой, чтобы найти сокровище!' : 'Scratch the layer to find a treasure!',
    claim: language === 'ru' ? 'ЗАБРАТЬ' : 'CLAIM REWARD',
    again: language === 'ru' ? 'ПОПРОБОВАТЬ СНОВА' : 'TRY AGAIN',
    prize: language === 'ru' ? 'ВАШ ВЫИГРЫШ:' : 'YOUR PRIZE:',
  };

  const initGame = () => {
    setIsRevealed(false);
    setScratchProgress(0);
    setShowFlash(false);
    const randomPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    setCurrentPrize(randomPrize);
    setTimeout(initCanvas, 50);
  };

  useEffect(() => { initGame(); }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (parent) { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; }
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#6366f1'); grad.addColorStop(0.5, '#ec4899'); grad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.font = 'bold 30px Arial';
    for(let i=0; i<50; i++) { ctx.fillText('?', Math.random() * canvas.width, Math.random() * canvas.height); ctx.fillText('★', Math.random() * canvas.width, Math.random() * canvas.height); }
    ctx.fillStyle = 'white'; ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(language === 'ru' ? 'СТЕРЕТЬ ЗДЕСЬ' : 'SCRATCH HERE', canvas.width/2, canvas.height/2);
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) { x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top; } 
    else { x = (e as React.MouseEvent).clientX - rect.left; y = (e as React.MouseEvent).clientY - rect.top; }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI * 2); ctx.fill();
    if (Math.random() > 0.5) checkProgress();
  };

  const checkProgress = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width; const h = canvas.height;
      const imageData = ctx.getImageData(w * 0.2, h * 0.2, w * 0.6, h * 0.6);
      const pixels = imageData.data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 16) { if (pixels[i] === 0) transparent++; }
      const percent = (transparent / (pixels.length / 16)) * 100;
      setScratchProgress(percent);
      if (percent > 40 && !isRevealed) { setIsRevealed(true); setShowFlash(true); ctx.clearRect(0, 0, canvas.width, canvas.height); }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-[600px] flex flex-col items-center justify-center touch-none">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 neon-text mb-4">{t.title}</h2>
           <p className="text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2"><Ticket className="w-5 h-5 text-green-400" /> {t.desc}</p>
        </div>
        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[520px] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-gray-700 bg-gray-900 overflow-hidden">
            <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${showFlash ? 'opacity-80' : 'opacity-0'}`} onTransitionEnd={() => setShowFlash(false)}></div>
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-800 to-gray-900`}>
                {currentPrize && (
                    <>
                        <div className={`text-sm font-bold uppercase tracking-widest mb-8 transition-all duration-700 delay-300 ${isRevealed ? 'opacity-100 translate-y-0 text-green-400' : 'opacity-0 -translate-y-4 text-gray-600'}`}>{t.prize}</div>
                        <div className={`relative z-10 transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${isRevealed ? 'scale-110 opacity-100' : 'scale-0 opacity-0'}`}>{currentPrize.icon}</div>
                        <h3 className={`relative z-10 text-3xl font-black text-white mt-8 text-center transition-all duration-700 delay-200 ${isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>{currentPrize.label[language]}</h3>
                        {isRevealed && <div className="absolute inset-0 pointer-events-none overflow-hidden"><Sparkles className="absolute top-1/4 left-1/4 w-8 h-8 text-yellow-400 animate-[spin_3s_linear_infinite]" /><Sparkles className="absolute bottom-1/4 right-1/4 w-6 h-6 text-white animate-[pulse_2s_infinite]" /><Star className="absolute top-10 right-10 w-4 h-4 text-pink-500 animate-bounce" /><div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent animate-pulse"></div></div>}
                        {isRevealed && <PartyPopper className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-yellow-500/20 animate-[ping_1s_ease-out]" />}
                    </>
                )}
            </div>
            <canvas ref={canvasRef} onMouseMove={scratch} onTouchMove={scratch} className={`absolute inset-0 cursor-crosshair transition-all duration-700 ease-out transform ${isRevealed ? 'opacity-0 scale-150 pointer-events-none' : 'opacity-100 scale-100'}`} />
            <div className={`absolute inset-0 border-4 rounded-[20px] pointer-events-none transition-colors duration-500 ${isRevealed ? 'border-green-500/50 shadow-[inset_0_0_30px_rgba(34,197,94,0.2)]' : 'border-transparent'}`}></div>
        </div>
        <div className="mt-12 h-20">
            {isRevealed && currentPrize && (
                <div className="flex gap-4 animate-[fadeIn_0.5s_ease-out]">
                    <button onClick={() => onWin(currentPrize.label[language], currentPrize.type)} className="px-8 py-4 bg-white text-black font-black rounded-full shadow-[0_0_30px_white] hover:scale-105 transition-transform flex items-center gap-2"><Gift className="w-5 h-5" /> {t.claim}</button>
                    <button onClick={initGame} className="px-8 py-4 border-2 border-gray-600 text-gray-400 font-bold rounded-full hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"><RotateCcw className="w-5 h-5" /> {t.again}</button>
                </div>
            )}
            {!isRevealed && <div className="text-gray-500 font-mono text-xs">{Math.round(scratchProgress)}% {language === 'ru' ? 'СТЕРТО' : 'REVEALED'}</div>}
        </div>
    </div>
  );
};

export default ScratchGame;
