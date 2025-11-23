
import React, { useMemo } from 'react';
import { Pizza, Language } from '../types';
import { Star, ExternalLink, Smartphone } from 'lucide-react';
import Pizza3DViewer from './Pizza3DViewer';

interface LocalizedPizzaData {
  id: string;
  name: { ru: string; en: string };
  description: { ru: string; en: string };
  price: number;
  category: 'classic' | 'spicy' | 'vegan' | 'sweet';
  isNewYearSpecial?: boolean;
  textureType: 'tangerine' | 'pomegranate';
}

// --- ADVANCED HYPER-REALISTIC TEXTURE GENERATOR ---
const generatePizzaTexture = (type: 'tangerine' | 'pomegranate'): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = 512;
  const cy = 512;

  // --- UTILS ---
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  
  // 1. HIGH-RES DOUGH BASE
  // Irregular Crust Shape
  ctx.beginPath();
  for (let i = 0; i <= 360; i += 2) {
      const angle = (i * Math.PI) / 180;
      const r = 500 + Math.random() * 10;
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  }
  ctx.closePath();
  
  // Baked Dough Gradient
  const doughGrad = ctx.createRadialGradient(cx, cy, 300, cx, cy, 512);
  doughGrad.addColorStop(0, '#f3e5ab'); // Rawish center
  doughGrad.addColorStop(0.5, '#e6a15c'); // Golden
  doughGrad.addColorStop(0.85, '#a0522d'); // Brown crust
  doughGrad.addColorStop(1, '#5d4037'); // Charred edge
  ctx.fillStyle = doughGrad;
  ctx.fill();

  // Texture: Flour Dust & Pores
  for (let i = 0; i < 2000; i++) {
      const r = rand(350, 510);
      const a = rand(0, Math.PI * 2);
      const s = rand(0.5, 2);
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, s, 0, Math.PI * 2);
      ctx.fill();
  }

  // Charred Bubbles on Crust
  for (let i = 0; i < 30; i++) {
      const r = rand(460, 500);
      const a = rand(0, Math.PI * 2);
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, rand(5, 15), rand(5, 15), 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 20, 10, 0.6)'; // Dark char
      ctx.filter = 'blur(2px)';
      ctx.fill();
      ctx.filter = 'none';
  }

  // 2. MELTED CHEESE & SAUCE
  // White Cream Sauce Base (Béchamel style for these pizzas)
  ctx.beginPath();
  for (let i = 0; i <= 360; i += 5) {
      const r = 440 + Math.random() * 15;
      const a = (i * Math.PI) / 180;
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
  
  const cheeseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 450);
  cheeseGrad.addColorStop(0, '#fffbf0'); // Creamy White
  cheeseGrad.addColorStop(0.8, '#fef3c7'); // Slight yellow tint
  cheeseGrad.addColorStop(1, '#fde68a'); // Baked edge
  ctx.fillStyle = cheeseGrad;
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Melted Cheese Texture (Oil sheen & unevenness)
  for (let i = 0; i < 150; i++) {
      const r = rand(0, 430);
      const a = rand(0, Math.PI * 2);
      const s = rand(10, 40);
      
      // Oil pool
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a)*r, cy + Math.sin(a)*r, s, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
      ctx.fill();
      
      // Highlight
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a)*r - 5, cy + Math.sin(a)*r - 5, s/3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.filter = 'blur(4px)';
      ctx.fill();
      ctx.filter = 'none';
  }

  // 3. REALISTIC INGREDIENTS

  const drawRealisticChicken = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      
      // Irregular Meat Shape
      ctx.beginPath();
      ctx.moveTo(-20, -15);
      ctx.quadraticCurveTo(0, -25, 25, -10);
      ctx.quadraticCurveTo(30, 10, 10, 20);
      ctx.quadraticCurveTo(-20, 25, -25, 5);
      ctx.closePath();

      // Meat Gradient
      const grad = ctx.createLinearGradient(-20, -20, 20, 20);
      grad.addColorStop(0, '#fcd34d'); // Golden cooked
      grad.addColorStop(1, '#d97706'); // Browned
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Grill Marks
      ctx.strokeStyle = 'rgba(146, 64, 14, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -20); ctx.lineTo(-5, 20);
      ctx.moveTo(10, -20); ctx.lineTo(15, 18);
      ctx.stroke();

      // Fiber Texture
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      for(let i=0; i<5; i++) {
          ctx.beginPath();
          ctx.moveTo(rand(-20, 20), rand(-20, 20));
          ctx.lineTo(rand(-20, 20), rand(-20, 20));
          ctx.stroke();
      }

      ctx.restore();
  };

  const drawRealisticTangerine = (x: number, y: number, rot: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(scale, scale);

      // Shadow on Cheese
      ctx.beginPath();
      ctx.ellipse(2, 2, 35, 20, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.filter = 'blur(4px)';
      ctx.fill();
      ctx.filter = 'none';

      // Segment Shape
      ctx.beginPath();
      ctx.moveTo(-38, -15);
      ctx.quadraticCurveTo(0, -35, 38, -15);
      ctx.quadraticCurveTo(45, 0, 35, 25);
      ctx.quadraticCurveTo(0, 35, -35, 25);
      ctx.quadraticCurveTo(-45, 0, -38, -15);
      ctx.closePath();

      // Juicy Inner Gradient
      const grad = ctx.createRadialGradient(-10, -10, 5, 0, 0, 40);
      grad.addColorStop(0, '#fed7aa'); // Light pulp
      grad.addColorStop(0.4, '#f97316'); // Vibrant orange
      grad.addColorStop(1, '#ea580c'); // Darker edge
      ctx.fillStyle = grad;
      ctx.fill();

      // Pulp Veins (The realistic part)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      for(let i=0; i<15; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const a = (i / 15) * Math.PI * 2;
          ctx.lineTo(Math.cos(a)*30, Math.sin(a)*20);
          ctx.stroke();
      }

      // Glossy Highlight (Wet look)
      ctx.beginPath();
      ctx.ellipse(-15, -10, 12, 6, -0.5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.filter = 'blur(2px)';
      ctx.fill();
      ctx.filter = 'none';

      // Skin/Pith Edge
      ctx.strokeStyle = '#fff7ed';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
  };

  const drawRealisticPomegranate = (x: number, y: number) => {
      // Cluster of seeds
      const seeds = 10 + Math.floor(Math.random() * 8);
      for(let i=0; i<seeds; i++) {
          const ox = rand(-25, 25);
          const oy = rand(-25, 25);
          const size = rand(5, 9);

          // Seed Base (Deep Ruby)
          ctx.beginPath();
          ctx.arc(x + ox, y + oy, size, 0, Math.PI*2);
          ctx.fillStyle = '#881337'; // Deep Red
          ctx.fill();

          // Inner Glow (Translucent look)
          ctx.beginPath();
          ctx.arc(x + ox, y + oy, size * 0.7, 0, Math.PI*2);
          ctx.fillStyle = '#e11d48'; // Bright Red
          ctx.fill();

          // Specular Highlight (Wet)
          ctx.beginPath();
          ctx.arc(x + ox - 2, y + oy - 2, size * 0.25, 0, Math.PI*2);
          ctx.fillStyle = 'white';
          ctx.globalAlpha = 0.8;
          ctx.fill();
          ctx.globalAlpha = 1.0;
      }
  };

  const drawRealisticDorblu = (x: number, y: number) => {
      // Mold veins
      const patches = 4 + Math.random() * 4;
      ctx.filter = 'blur(1px)';
      for(let i=0; i<patches; i++) {
          const ox = rand(-20, 20);
          const oy = rand(-20, 20);
          const s = rand(4, 10);
          ctx.beginPath();
          ctx.arc(x+ox, y+oy, s, 0, Math.PI*2);
          ctx.fillStyle = '#334155'; // Dark blue-grey
          ctx.fill();
          
          // Spread
          ctx.beginPath();
          ctx.arc(x+ox, y+oy, s*1.5, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
          ctx.fill();
      }
      ctx.filter = 'none';
  };

  const drawRealisticRosemary = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      
      ctx.strokeStyle = '#14532d'; // Dark Green Stem
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke();

      // Needles
      for(let j=-18; j<18; j+=3) {
          const len = rand(8, 12);
          const angle = 0.5 + rand(-0.1, 0.1);
          
          // Needle Top
          ctx.beginPath();
          ctx.moveTo(j, 0);
          ctx.lineTo(j + len*Math.cos(-angle), len*Math.sin(-angle));
          ctx.strokeStyle = '#16a34a'; // Brighter Green
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Needle Bottom
          ctx.beginPath();
          ctx.moveTo(j, 0);
          ctx.lineTo(j + len*Math.cos(angle), len*Math.sin(angle));
          ctx.stroke();
      }
      ctx.restore();
  };

  // --- LAYERING INGREDIENTS ---

  // 1. Chicken Base (Common for both)
  for (let i = 0; i < 14; i++) {
      const r = rand(0, 380);
      const t = rand(0, Math.PI * 2);
      drawRealisticChicken(cx + Math.cos(t)*r, cy + Math.sin(t)*r, rand(0, Math.PI));
  }

  if (type === 'tangerine') {
      // Dorblu (Under & Around)
      for (let i = 0; i < 20; i++) {
          const r = rand(50, 420);
          const t = rand(0, Math.PI * 2);
          drawRealisticDorblu(cx + Math.cos(t)*r, cy + Math.sin(t)*r);
      }
      // Tangerines (Top Layer - Hero)
      for (let i = 0; i < 18; i++) {
          const r = rand(40, 360);
          const t = rand(0, Math.PI * 2);
          drawRealisticTangerine(cx + Math.cos(t)*r, cy + Math.sin(t)*r, rand(0, Math.PI), rand(0.9, 1.2));
      }
  } 
  else if (type === 'pomegranate') {
      // Tangerine Accents
      for (let i = 0; i < 8; i++) {
          const r = rand(80, 380);
          const t = rand(0, Math.PI * 2);
          drawRealisticTangerine(cx + Math.cos(t)*r, cy + Math.sin(t)*r, rand(0, Math.PI), 0.9);
      }
      // Pomegranate Clusters (Jewels)
      for (let i = 0; i < 16; i++) {
          const r = rand(0, 400);
          const t = rand(0, Math.PI * 2);
          drawRealisticPomegranate(cx + Math.cos(t)*r, cy + Math.sin(t)*r);
      }
      // Rosemary Sprigs
      for (let i = 0; i < 10; i++) {
          const r = rand(100, 420);
          const t = rand(0, Math.PI * 2);
          drawRealisticRosemary(cx + Math.cos(t)*r, cy + Math.sin(t)*r, rand(0, Math.PI));
      }
  }

  // Final Ambient Occlusion Vignette
  const vignette = ctx.createRadialGradient(cx, cy, 460, cx, cy, 512);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(30, 10, 0, 0.5)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 1024, 1024);

  return canvas.toDataURL('image/jpeg', 0.95);
};

const PIZZA_DATA: LocalizedPizzaData[] = [
  { 
    id: '1', 
    name: { ru: 'Новогодняя', en: 'New Year Special' }, 
    description: { 
      ru: 'Изысканное сочетание нежной курицы, сладких долек мандарина и пикантного сыра Дорблю на сливочной основе.', 
      en: 'A gourmet fusion of tender chicken, sweet tangerine slices, and bold Dorblu blue cheese on a creamy white base.' 
    }, 
    price: 755, 
    category: 'classic',
    isNewYearSpecial: true,
    textureType: 'tangerine'
  },
  { 
    id: '2', 
    name: { ru: 'Рождественская', en: 'Christmas Special' }, 
    description: { 
      ru: 'Праздничный шедевр с зернами граната, сочными дольками мандарина, курицей и свежим розмарином.', 
      en: 'Festive masterpiece featuring pomegranate seeds, juicy mandarin segments, chicken, and fresh rosemary.' 
    }, 
    price: 755, 
    category: 'sweet',
    isNewYearSpecial: true,
    textureType: 'pomegranate'
  }
];

interface MenuProps {
  language: Language;
}

const Menu: React.FC<MenuProps> = ({ language }) => {
  const t = {
    title: language === 'ru' ? 'НОВОГОДНЯЯ КОЛЛЕКЦИЯ' : 'NEW YEAR COLLECTION',
    subtitle: language === 'ru' ? 'Лимитированная серия 3D-пицц' : 'Limited Edition 3D Pizzas',
    // Specific text requested by user
    cta: language === 'ru' ? 'Скорее заказывай на нашем сайте или в моб.прилож.' : 'Order now on our website or app!',
  };

  // Generate textures once on mount
  const pizzasWithTextures = useMemo(() => {
    return PIZZA_DATA.map(p => ({
      ...p,
      image: generatePizzaTexture(p.textureType), // Generate the "Hand Drawn" texture
      name: p.name[language],
      description: p.description[language]
    }));
  }, [language]);

  return (
    <div className="py-16 relative min-h-screen flex flex-col items-center">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-16 z-10 relative">
         <h2 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 neon-text drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
           {t.title}
         </h2>
         <p className="text-gray-400 text-lg uppercase tracking-[0.3em] animate-pulse">{t.subtitle}</p>
      </div>
      
      {/* 3D Showcase Layout */}
      <div className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-8 items-center justify-center relative z-10">
        {pizzasWithTextures.map((pizza, index) => (
          <div 
            key={pizza.id} 
            className="relative flex flex-col items-center group"
          >
            {/* 3D Floating Container */}
            <div className="relative w-full h-[400px] md:h-[500px] mb-8">
              {/* Neon Glow behind the pizza */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${index === 0 ? 'bg-orange-500/30' : 'bg-red-500/30'}`}></div>
              
              {/* The 3D Viewer - Floating Effect */}
              <div className="w-full h-full animate-[float_6s_ease-in-out_infinite] hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
                 <Pizza3DViewer 
                    imageUrl={pizza.image} 
                    name={pizza.name} 
                    language={language} 
                    transparent={true} 
                    scale={1.3} // Increased scale for impact
                 />
              </div>
            </div>

            {/* Info Block - Floating Separately */}
            <div className="text-center space-y-4 max-w-md backdrop-blur-sm bg-black/20 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">{pizza.name}</h3>
                
                <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base">
                  {pizza.description}
                </p>

                <div className="pt-4 flex flex-col items-center gap-4">
                   <div className="text-center">
                      <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Цена</span>
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {pizza.price} ₽
                      </span>
                   </div>
                   
                   {/* Informational "Plate" instead of Link */}
                   <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border border-white/20 text-gray-200 px-4 py-3 rounded-xl font-medium shadow-lg flex flex-col items-center justify-center text-center text-xs leading-relaxed gap-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-2 text-pink-400 mb-1">
                          <Smartphone className="w-4 h-4 animate-pulse" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">INFO</span>
                      </div>
                      <span className="z-10 font-bold">{t.cta}</span>
                   </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for Floating Animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Menu;
