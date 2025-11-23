
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language } from '../types';
import { Timer, DollarSign, Trash2, Flame, Check, ArrowRight, Undo2, Scissors, Box, Utensils, Heart, Star, Cloud, X, Thermometer, Play, Pause, RotateCcw } from 'lucide-react';

interface PizzaKitchenProps {
  onGameOver: (score: number) => void;
  language: Language;
  autoStart?: boolean;
}

// ... (Keep Ingredients and Order Logic) ...
type Ingredient = 'sauce' | 'cheese' | 'pepperoni' | 'mushroom' | 'basil' | 'olive' | 'onion' | 'bacon' | 'pineapple' | 'pepper' | 'shrimp';
type PizzaState = 'order' | 'prep' | 'baking' | 'cutting' | 'boxing' | 'finish';
type Mood = 'idle' | 'happy' | 'sad' | 'panic' | 'cooking' | 'waiting';

interface ToppingObject {
  id: number;
  type: Ingredient;
  x: number;
  y: number;
  rot: number;
  scale: number;
}

interface Order {
  id: number;
  text: { ru: string, en: string };
  requirements: Ingredient[];
  forbidden: Ingredient[];
  slices: number; // 0, 2, 4, 6, 8
  price: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

const INGREDIENTS: { id: Ingredient; color: string; label: { ru: string, en: string }; icon: string }[] = [
  { id: 'sauce', color: '#ef4444', label: { en: 'Sauce', ru: 'Соус' }, icon: '🍅' },
  { id: 'cheese', color: '#fef08a', label: { en: 'Cheese', ru: 'Сыр' }, icon: '🧀' },
  { id: 'pepperoni', color: '#b91c1c', label: { en: 'Pepperoni', ru: 'Пепперони' }, icon: '🍕' },
  { id: 'mushroom', color: '#a8a29e', label: { en: 'Mushroom', ru: 'Грибы' }, icon: '🍄' },
  { id: 'olive', color: '#171717', label: { en: 'Olive', ru: 'Оливки' }, icon: '🫒' },
  { id: 'onion', color: '#fdf2f8', label: { en: 'Onion', ru: 'Лук' }, icon: '🧅' },
  { id: 'bacon', color: '#fca5a5', label: { en: 'Bacon', ru: 'Бекон' }, icon: '🥓' },
  { id: 'pepper', color: '#16a34a', label: { en: 'Pepper', ru: 'Перец' }, icon: '🫑' },
  { id: 'pineapple', color: '#fde047', label: { en: 'Pineapple', ru: 'Ананас' }, icon: '🍍' },
  { id: 'shrimp', color: '#fb7185', label: { en: 'Shrimp', ru: 'Креветки' }, icon: '🍤' },
  { id: 'basil', color: '#22c55e', label: { en: 'Basil', ru: 'Базилик' }, icon: '🌿' },
];

const ORDERS: Order[] = [
  { id: 1, text: { ru: "Классика: Красный соус, сыр. 6 кусков.", en: "Classic: Red sauce, cheese. 6 slices." }, requirements: ['sauce', 'cheese'], forbidden: ['pepperoni', 'mushroom', 'basil', 'olive', 'onion', 'bacon', 'pineapple', 'pepper', 'shrimp'], slices: 6, price: 12 },
  { id: 2, text: { ru: "Пепперони! Порежь на 8 частей.", en: "Pepperoni feast! Cut into 8." }, requirements: ['sauce', 'cheese', 'pepperoni'], forbidden: [], slices: 8, price: 18 },
  { id: 3, text: { ru: "Грибная поляна с луком. Без нарезки.", en: "Mushroom field with onion. No cut." }, requirements: ['sauce', 'cheese', 'mushroom', 'onion'], forbidden: ['pepperoni', 'bacon'], slices: 0, price: 20 },
  { id: 4, text: { ru: "Гавайская (Ананас + Ветчина). 4 куска.", en: "Hawaiian (Pineapple + Bacon). 4 slices." }, requirements: ['sauce', 'cheese', 'pineapple', 'bacon'], forbidden: ['olive', 'onion'], slices: 4, price: 24 },
  { id: 5, text: { ru: "Острая! Перчик и Мясо! 8 кусков.", en: "Spicy! Peppers and Meat! 8 slices." }, requirements: ['sauce', 'cheese', 'pepperoni', 'bacon', 'pepper'], forbidden: [], slices: 8, price: 28 },
  { id: 6, text: { ru: "Морская: Креветки и базилик. Пополам.", en: "Sea style: Shrimp and Basil. Cut in half." }, requirements: ['sauce', 'cheese', 'shrimp', 'basil'], forbidden: [], slices: 2, price: 30 },
];

// --- CHEF CHARACTER (SVG) ---
// Optimized with React.memo to prevent re-renders on every mouse move
const ChefCharacter = React.memo(({ mood }: { mood: Mood }) => {
  // Dynamic facial expressions
  const getMouth = () => {
    if (mood === 'happy') return "M 45 75 Q 50 85 55 75"; // Smile
    if (mood === 'sad') return "M 45 80 Q 50 70 55 80"; // Frown
    if (mood === 'panic') return "M 45 78 Q 50 70 55 78"; // Open worried
    if (mood === 'cooking') return "M 48 78 L 52 78"; // Concentrated
    if (mood === 'waiting') return "M 48 75 L 52 75"; // Neutral
    return "M 45 75 Q 50 78 55 75"; // Idle
  };

  const getEyes = () => {
    if (mood === 'panic') return { l: "M 38 60 Q 40 55 42 60", r: "M 58 60 Q 60 55 62 60" }; // Wide
    if (mood === 'happy') return { l: "M 38 62 Q 40 58 42 62", r: "M 58 62 Q 60 58 62 62" }; // Happy squint
    if (mood === 'cooking') return { l: "M 38 65 L 42 65", r: "M 58 65 L 62 65" }; // Focused squint
    return { l: "M 40 60 A 1 1 0 0 0 40 62", r: "M 60 60 A 1 1 0 0 0 60 62" }; // Dots
  };

  const eyes = getEyes();

  return (
    <div className={`relative w-32 h-40 md:w-40 md:h-48 drop-shadow-xl transition-transform duration-500 ${mood === 'cooking' ? 'translate-y-4' : 'animate-[float_3s_ease-in-out_infinite]'}`}>
       <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
          {/* Body/Shirt */}
          <path d="M 20 120 L 20 90 Q 20 80 30 85 L 30 120 L 70 120 L 70 85 Q 80 80 80 90 L 80 120 Z" fill="white" stroke="#d1d5db" strokeWidth="1" />
          <rect x="20" y="90" width="60" height="30" fill="white" />
          
          {/* Shirt Collar */}
          <path d="M 30 85 L 50 100 L 70 85" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
          <circle cx="50" cy="105" r="1.5" fill="#374151" />
          <circle cx="50" cy="112" r="1.5" fill="#374151" />

          {/* BRANDING: Red Heart Logo on Shirt */}
          <path d="M 50 96 C 45 90 40 94 40 98 C 40 104 50 110 50 110 C 50 110 60 104 60 98 C 60 94 55 90 50 96" fill="#dc2626" />

          {/* Neck */}
          <rect x="40" y="75" width="20" height="15" fill="#fecaca" />

          {/* Head Shape (Long/Oval) */}
          <ellipse cx="50" cy="60" rx="18" ry="25" fill="#fecaca" />
          
          {/* Ears */}
          <ellipse cx="32" cy="60" rx="3" ry="5" fill="#fecaca" />
          <ellipse cx="68" cy="60" rx="3" ry="5" fill="#fecaca" />

          {/* BRANDED CAP (Replaces Top Hair) */}
          <g transform="translate(0, -2)">
             {/* Cap Dome */}
             <path d="M 25 50 C 25 25 75 25 75 50" fill="#dc2626" stroke="#b91c1c" strokeWidth="1"/>
             {/* Cap Visor */}
             <path d="M 22 50 Q 50 65 78 50 Q 50 55 22 50" fill="#b91c1c" />
             {/* Logo Badge on Cap */}
             <circle cx="50" cy="35" r="9" fill="white" />
             <path d="M 50 40 C 44 35 42 37 42 39 C 42 43 50 46 50 46 C 50 46 58 43 58 39 C 58 37 56 35 50 40" fill="#dc2626" />
          </g>

          {/* Sideburns (Still visible under cap) */}
          <path d="M 32 50 L 32 70 C 32 75 28 70 28 65 Z" fill="#3e2723" />
          <path d="M 68 50 L 68 70 C 68 75 72 70 72 65 Z" fill="#3e2723" />

          {/* Face Features */}
          <path d={eyes.l} fill="#1f2937" stroke="#1f2937" strokeWidth="1.5" />
          <path d={eyes.r} fill="#1f2937" stroke="#1f2937" strokeWidth="1.5" />
          
          {/* Long Nose */}
          <path d="M 50 55 Q 45 70 50 72" fill="none" stroke="#e5a3a3" strokeWidth="2" />
          <circle cx="50" cy="70" r="3" fill="#fecaca" opacity="0.5" />

          {/* Mouth */}
          <path d={getMouth()} fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />

          {/* Blush */}
          <ellipse cx="38" cy="68" rx="3" ry="1.5" fill="#f87171" opacity="0.3" />
          <ellipse cx="62" cy="68" rx="3" ry="1.5" fill="#f87171" opacity="0.3" />
          
          {/* Sweat Drop (Panic) */}
          {mood === 'panic' && (
             <path d="M 70 40 Q 75 45 70 50 Q 65 45 70 40" fill="#60a5fa" className="animate-bounce" />
          )}
       </svg>
    </div>
  );
});

const PizzaKitchen: React.FC<PizzaKitchenProps> = ({ onGameOver, language, autoStart }) => {
  const [money, setMoney] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  
  // ... (Keep State vars) ...
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeTool, setActiveTool] = useState<Ingredient | null>(null);
  const [pizzaStage, setPizzaStage] = useState<PizzaState>('prep');
  
  // Pizza State
  const [hasSauce, setHasSauce] = useState(false);
  const [hasCheese, setHasCheese] = useState(false);
  const [toppings, setToppings] = useState<ToppingObject[]>([]);
  const [cuts, setCuts] = useState<number[]>([]);
  
  // Oven State
  const [ovenTemp, setOvenTemp] = useState(0); // 0 - 100
  const [isOvenOn, setIsOvenOn] = useState(false);
  const [bakeStatus, setBakeStatus] = useState<'raw' | 'perfect' | 'burnt'>('raw');

  // UX State
  const [feedback, setFeedback] = useState<{msg: string, type: 'good'|'bad'} | null>(null);
  const [chefMood, setChefMood] = useState<Mood>('idle');
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [previewCutAngle, setPreviewCutAngle] = useState<number | null>(null);
  
  // REFS for Optimization
  const boardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const t = {
    title: language === 'ru' ? 'ШЕФ ЛЮБЛЮPIZZA PRO' : 'CHEF LYUBLUPIZZA PRO',
    start: language === 'ru' ? 'ОТКРЫТЬ ПИЦЦЕРИЮ' : 'OPEN PIZZERIA',
    // ... (Keep translations) ...
    oven: language === 'ru' ? 'ДУХОВКА' : 'OVEN',
    ovenOn: language === 'ru' ? 'НАГРЕВ' : 'HEAT UP',
    ovenOff: language === 'ru' ? 'СТОП' : 'STOP',
    pull: language === 'ru' ? 'ДОСТАТЬ' : 'PULL OUT',
    cut: language === 'ru' ? 'НАРЕЗКА' : 'CUTTING',
    serve: language === 'ru' ? 'ОТДАТЬ' : 'SERVE',
    box: language === 'ru' ? 'УПАКОВАТЬ' : 'BOX IT',
    trash: language === 'ru' ? 'В мусор' : 'Trash',
    raw: language === 'ru' ? 'СЫРАЯ' : 'RAW',
    perfect: language === 'ru' ? 'ИДЕАЛЬНО' : 'PERFECT',
    burnt: language === 'ru' ? 'СГОРЕЛА' : 'BURNT',
    tips: language === 'ru' ? 'ЧАЕВЫЕ' : 'TIPS',
    total: language === 'ru' ? 'ИТОГО' : 'TOTAL',
    slices: language === 'ru' ? 'Куски' : 'Slices',
    finish: language === 'ru' ? 'СМЕНА ОКОНЧЕНА' : 'SHIFT ENDED',
    claim: language === 'ru' ? 'ЗАБРАТЬ' : 'CLAIM',
    included: language === 'ru' ? 'ВКЛЮЧЕНЫ' : 'INCLUDED',
    restart: language === 'ru' ? 'ЗАНОВО' : 'RESTART',
    toppings: language === 'ru' ? 'ИНГРЕДИЕНТЫ' : 'TOPPINGS',
    order: language === 'ru' ? 'ЗАКАЗ №' : 'ORDER #',
    
    // Feedback
    pop: language === 'ru' ? 'Чпок!' : 'Pop!',
    splosh: language === 'ru' ? 'Плюх!' : 'Splosh!',
    cheesy: language === 'ru' ? 'Сырно!' : 'Cheesy!',
    chop: language === 'ru' ? 'Вжик!' : 'Chop!',
    tooRaw: language === 'ru' ? 'Слишком сырая!' : 'Too Raw!',
    tooBurnt: language === 'ru' ? 'Угольки!' : 'Burnt crisp!',
    golden: language === 'ru' ? 'Идеальный цвет!' : 'Golden Perfect!',
    success: language === 'ru' ? 'Успех!' : 'Success!',
    messy: language === 'ru' ? 'Ужас!' : 'Messy!',
    noSauce: language === 'ru' ? 'Нет соуса' : 'No Sauce',
    noCheese: language === 'ru' ? 'Нет сыра' : 'No Cheese',
    need: language === 'ru' ? 'Нужен' : 'Need',
    no: language === 'ru' ? 'Без' : 'No',
    rawDough: language === 'ru' ? 'Сырое тесто' : 'Raw Dough',
    burntMessage: language === 'ru' ? 'Сгорела' : 'Burnt'
  };

  // --- GAME LOOP & TIMERS ---

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('end');
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // OVEN LOGIC
  useEffect(() => {
    let ovenInterval: any;
    if (pizzaStage === 'baking' && isOvenOn) {
       ovenInterval = setInterval(() => {
          setOvenTemp(prev => {
             const next = prev + 0.6; // Slowed down for better control
             if (next > 100) {
                setIsOvenOn(false);
                return 100;
             }
             return next;
          });
       }, 50);
    }
    return () => clearInterval(ovenInterval);
  }, [pizzaStage, isOvenOn]);

  // Determine Bake Status
  useEffect(() => {
     if (ovenTemp < 40) setBakeStatus('raw');
     else if (ovenTemp >= 40 && ovenTemp <= 80) setBakeStatus('perfect'); // Larger "Gold Zone"
     else setBakeStatus('burnt');
  }, [ovenTemp]);

  const startGame = () => {
    setMoney(0);
    setTimeLeft(180);
    setGameState('playing');
    nextOrder();
  };

  // Auto Start
  useEffect(() => {
      if (autoStart && gameState === 'start') {
          startGame();
      }
  }, [autoStart]);

  const nextOrder = () => {
    resetPizza();
    const random = ORDERS[Math.floor(Math.random() * ORDERS.length)];
    setCurrentOrder(random);
    setChefMood('idle');
  };

  const resetPizza = () => {
    setHasSauce(false);
    setHasCheese(false);
    setToppings([]);
    setCuts([]);
    setPizzaStage('prep');
    setOvenTemp(0);
    setIsOvenOn(false);
    setBakeStatus('raw');
    setActiveTool(null);
    setFeedback(null);
  };

  const addFloatingText = (x: number, y: number, text: string, color: string = '#fff') => {
      const id = Date.now();
      setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
      setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== id));
      }, 1000);
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dist = Math.sqrt((x-cx)**2 + (y-cy)**2);

    if (pizzaStage === 'prep') {
        if (dist > 150) return; // Off pizza
        
        if (!activeTool) {
            return;
        }

        if (activeTool === 'sauce') {
            if (!hasSauce) {
                setHasSauce(true);
                addFloatingText(x, y, t.splosh, "#ef4444");
            }
        } else if (activeTool === 'cheese') {
            if (!hasCheese) {
                setHasCheese(true);
                addFloatingText(x, y, t.cheesy, "#fef08a");
            }
        } else {
            // Add Topping
            setToppings(prev => [...prev, { 
              id: Date.now(), 
              type: activeTool, 
              x: x, 
              y: y, 
              rot: Math.random() * 360,
              scale: 0.8 + Math.random() * 0.4 
            }]);
            addFloatingText(x, y, t.pop, "#fff");
        }
        setChefMood('cooking');
        setTimeout(() => setChefMood('idle'), 300);
    } else if (pizzaStage === 'cutting') {
        if (dist > 160) return;
        if (previewCutAngle !== null) {
            // Check prevents double cutting same angle
            const exists = cuts.some(c => Math.abs(c - previewCutAngle) < 10);
            if (cuts.length < 4 && !exists) {
                setCuts(prev => [...prev, previewCutAngle]);
                addFloatingText(x, y, t.chop, "#fff");
            }
        }
    } else if (pizzaStage === 'boxing') {
        // Click to close box
        handleServe();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boardRef.current) return;
      
      // Direct DOM update for cursor - bypass React state for performance
      if (cursorRef.current) {
          const rect = boardRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Apply transform directly
          let transform = `translate(${x}px, ${y}px)`;
          if (pizzaStage === 'cutting') {
              transform += ' translate(-50%, -50%) rotate(-45deg)';
          } else if (pizzaStage === 'prep' && activeTool) {
              transform += ' translate(20px, 20px)';
          }
          cursorRef.current.style.transform = transform;

          if (pizzaStage === 'cutting') {
              const cx = rect.width / 2;
              const cy = rect.height / 2;
              const angleRad = Math.atan2(y - cy, x - cx);
              let angleDeg = angleRad * (180 / Math.PI);
              if (angleDeg < 0) angleDeg += 360;
              
              // Snap to 45 deg
              const SNAP = 45;
              const remainder = angleDeg % SNAP;
              if (remainder < 15 || remainder > SNAP - 15) {
                  angleDeg = Math.round(angleDeg / SNAP) * SNAP;
              }
              const newAngle = angleDeg % 180;
              
              // Only update React state if angle changed (throttling)
              if (newAngle !== previewCutAngle) {
                  setPreviewCutAngle(newAngle);
              }
          }
      }
  };

  const handlePhaseTransition = () => {
     if (pizzaStage === 'prep') {
         setPizzaStage('baking');
     } else if (pizzaStage === 'baking') {
         if (bakeStatus === 'raw') {
             setFeedback({ msg: t.tooRaw, type: 'bad' });
             setChefMood('sad');
         } else if (bakeStatus === 'burnt') {
             setFeedback({ msg: t.tooBurnt, type: 'bad' });
             setChefMood('panic');
         } else {
             setFeedback({ msg: t.golden, type: 'good' });
             setChefMood('happy');
         }
         setPizzaStage('cutting');
         setIsOvenOn(false);
     } else if (pizzaStage === 'cutting') {
         setPizzaStage('boxing');
     }
  };

  const handleServe = () => {
    if (!currentOrder) return;
    
    let valid = true;
    const errors: string[] = [];
    let tip = 0;

    // Validate
    if (currentOrder.requirements.includes('sauce') && !hasSauce) { valid = false; errors.push(t.noSauce); }
    if (currentOrder.requirements.includes('cheese') && !hasCheese) { valid = false; errors.push(t.noCheese); }
    
    const placedTypes = new Set(toppings.map(t => t.type));
    currentOrder.requirements.forEach(req => {
        const ing = INGREDIENTS.find(i => i.id === req);
        const ingName = ing?.label[language === 'ru' ? 'ru' : 'en'] || req;
        
        if (req !== 'sauce' && req !== 'cheese' && !placedTypes.has(req)) {
            valid = false; errors.push(`${t.need} ${ingName}`);
        }
    });
    
    toppings.forEach(top => {
        const ing = INGREDIENTS.find(i => i.id === top.type);
        const ingName = ing?.label[language === 'ru' ? 'ru' : 'en'] || top.type;
        
        if (currentOrder.forbidden.includes(top.type)) { valid = false; errors.push(`${t.no} ${ingName}!`); }
    });

    if (bakeStatus === 'raw') { valid = false; errors.push(t.rawDough); }
    if (bakeStatus === 'burnt') { valid = false; errors.push(t.burntMessage); }

    const slices = cuts.length * 2;
    if (currentOrder.slices > 0 && slices !== currentOrder.slices) valid = false;
    if (currentOrder.slices === 0 && slices > 0) valid = false;

    if (valid) {
        tip = Math.floor(Math.random() * 8) + 2;
        setMoney(prev => prev + currentOrder.price + tip);
        setFeedback({ msg: `${t.success} +$${currentOrder.price + tip}`, type: 'good' });
        setChefMood('happy');
    } else {
        setMoney(prev => Math.max(0, prev - 5));
        setFeedback({ msg: errors[0] || t.messy, type: 'bad' });
        setChefMood('sad');
    }

    setPizzaStage('finish');
    setTimeout(nextOrder, 2000);
  };

  // Dynamic Colors for Baked Pizza
  const getCrustColor = () => {
      if (pizzaStage === 'prep') return '#f3e5ab';
      // Baking gradient
      if (bakeStatus === 'raw') return `rgb(${243 - (ovenTemp * 0.5)}, ${229 - (ovenTemp * 0.5)}, ${171 - (ovenTemp * 0.5)})`; 
      if (bakeStatus === 'perfect') return '#e6a15c';
      return '#3e2723';
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 select-none">
        <div className="relative bg-amber-50 rounded-[40px] shadow-2xl overflow-hidden border-8 border-amber-900 min-h-[700px] flex flex-col">
            
            {/* --- TOP HUD --- */}
            <div className="bg-amber-900 text-[#fff8e1] p-4 flex justify-between items-center shadow-lg z-30 border-b-4 border-amber-950">
                <div className="flex items-center gap-6">
                   <div className="bg-black/30 px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                      <Timer className="w-5 h-5 text-yellow-400" />
                      <span className={`font-mono font-bold text-2xl ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                   </div>
                   <div className="bg-black/30 px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="font-mono font-bold text-2xl text-white">{money}</span>
                   </div>
                </div>
                
                {/* Stage Indicator */}
                {gameState === 'playing' && (
                   <div className="flex gap-2">
                      <div className={`w-3 h-3 rounded-full ${pizzaStage === 'prep' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
                      <div className={`w-3 h-3 rounded-full ${pizzaStage === 'baking' ? 'bg-orange-500 animate-pulse' : 'bg-white/20'}`}></div>
                      <div className={`w-3 h-3 rounded-full ${pizzaStage === 'cutting' ? 'bg-blue-500 animate-pulse' : 'bg-white/20'}`}></div>
                      <div className={`w-3 h-3 rounded-full ${pizzaStage === 'boxing' ? 'bg-purple-500 animate-pulse' : 'bg-white/20'}`}></div>
                   </div>
                )}
            </div>

            {gameState === 'playing' && (
            <div className="flex-1 flex relative overflow-hidden">
                
                {/* --- LEFT SIDE: CHEF & ORDER --- */}
                <div className="w-80 bg-[#f5e6d3] border-r-4 border-[#d7ccc8] flex flex-col shadow-xl relative z-20">
                   
                   {/* Chef Animation */}
                   <div className="h-64 flex justify-center items-end bg-[#eecfa1] border-b-4 border-[#d7ccc8] relative overflow-hidden">
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                       <ChefCharacter mood={chefMood} />
                   </div>

                   {/* Order Receipt */}
                   <div className="flex-1 p-4 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-[#fffbeb]">
                       <div className="border-t-4 border-dashed border-gray-300 pt-4 relative">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                          <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 mb-2">{t.order} {currentOrder?.id}</h3>
                          <p className="text-gray-800 font-serif text-lg leading-snug mb-4">{currentOrder?.text[language === 'ru' ? 'ru' : 'en']}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-500 uppercase">
                             <div className="bg-gray-100 p-2 rounded">
                                {t.slices} <span className="text-black text-lg block">{currentOrder?.slices || '0'}</span>
                             </div>
                             <div className="bg-gray-100 p-2 rounded">
                                {t.total} <span className="text-green-600 text-lg block">${currentOrder?.price}</span>
                             </div>
                          </div>
                       </div>
                   </div>
                </div>

                {/* --- CENTER: WORKSTATION --- */}
                <div 
                   className={`flex-1 relative flex flex-col items-center justify-center transition-colors duration-700
                      ${pizzaStage === 'prep' ? 'bg-[#ffecb3]' : 
                        pizzaStage === 'baking' ? 'bg-[#3e2723]' : 
                        pizzaStage === 'cutting' ? 'bg-[#cfd8dc]' : 'bg-[#f3e5f5]'}
                   `}
                   ref={boardRef}
                   onClick={handleBoardClick}
                   onMouseMove={handleMouseMove}
                >
                   {/* Dynamic Environment Overlay */}
                   <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

                   {/* CUSTOM CURSOR (Optimized with ref) */}
                   <div 
                      ref={cursorRef}
                      className={`absolute pointer-events-none z-50 transition-opacity duration-200 will-change-transform top-0 left-0 ${
                          (pizzaStage === 'cutting' || (pizzaStage === 'prep' && activeTool)) ? 'opacity-100' : 'opacity-0'
                      }`}
                   >
                       {pizzaStage === 'cutting' ? (
                           <div className="text-6xl drop-shadow-2xl">
                               <Utensils className="text-gray-200 fill-gray-300" />
                           </div>
                       ) : (
                           <div className="text-4xl drop-shadow-xl opacity-80">
                               {INGREDIENTS.find(i => i.id === activeTool)?.icon}
                           </div>
                       )}
                   </div>

                   {/* BAKING STATION OVERLAY */}
                   {pizzaStage === 'baking' && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                           {/* Heat Waves */}
                           <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-pulse"></div>
                           <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-red-600/30 to-transparent"></div>
                       </div>
                   )}

                   {/* PIZZA OBJECT */}
                   <div 
                      className={`
                        relative w-[450px] h-[450px] rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-700 ease-in-out z-10 group
                        ${pizzaStage === 'prep' ? 'scale-100' : ''}
                        ${pizzaStage === 'baking' ? 'scale-90 translate-y-8 brightness-90' : ''}
                        ${pizzaStage === 'boxing' ? 'scale-75 translate-y-12' : ''}
                        ${pizzaStage === 'finish' ? 'translate-x-[200%] rotate-12' : ''}
                        ${pizzaStage === 'cutting' ? 'cursor-none' : 'cursor-pointer'}
                      `}
                      style={{ backgroundColor: getCrustColor() }}
                   >
                      {/* Crust Border */}
                      <div className="absolute inset-0 rounded-full border-[16px] border-black/5 pointer-events-none"></div>

                      {/* Sauce Layer (Animated Spread) */}
                      <div 
                        className={`absolute inset-4 rounded-full bg-red-600 transition-all duration-700 ease-out ${hasSauce ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                        style={{ backgroundImage: 'radial-gradient(#b91c1c 10%, transparent 10%)', backgroundSize: '30px 30px' }}
                      ></div>

                      {/* Cheese Layer (Animated Melt) */}
                      <div 
                        className={`absolute inset-6 rounded-full bg-[#fff59d] transition-all duration-700 ease-out ${hasCheese ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                        style={{ maskImage: 'radial-gradient(black 40%, transparent 90%)' }}
                      ></div>

                      {/* Toppings */}
                      {toppings.map(top => (
                          <div 
                             key={top.id} 
                             className="absolute text-4xl pointer-events-none animate-[bounce_0.4s_ease-out]"
                             style={{ 
                                 left: top.x - 20, top: top.y - 20, 
                                 transform: `rotate(${top.rot}deg) scale(${top.scale})` 
                             }}
                          >
                             {INGREDIENTS.find(i => i.id === top.type)?.icon}
                          </div>
                      ))}

                      {/* Cuts */}
                      {cuts.map((angle, idx) => (
                          <div key={idx} className="absolute top-1/2 left-1/2 w-[120%] h-1 bg-black/10 pointer-events-none" style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}></div>
                      ))}
                      {/* Preview Cut */}
                      {pizzaStage === 'cutting' && previewCutAngle !== null && (
                          <div className="absolute top-1/2 left-1/2 w-[120%] h-1 border-b-4 border-dashed border-white/60 pointer-events-none" style={{ transform: `translate(-50%, -50%) rotate(${previewCutAngle}deg)` }}></div>
                      )}
                   </div>

                   {/* BOX LID (Only in boxing stage) */}
                   {pizzaStage === 'boxing' && (
                       <div className="absolute z-20 pointer-events-none animate-[zoomIn_0.5s_ease-out]">
                           <Box className="w-[500px] h-[500px] text-[#5d4037] fill-[#8d6e63] drop-shadow-2xl opacity-90" />
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-2xl animate-pulse uppercase">{t.box}</div>
                       </div>
                   )}

                   {/* FLOATING TEXTS */}
                   {floatingTexts.map(ft => (
                       <div key={ft.id} className="absolute font-black text-2xl pointer-events-none animate-[floatUp_0.8s_ease-out_forwards]" style={{ left: ft.x, top: ft.y, color: ft.color, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                           {ft.text}
                       </div>
                   ))}
                   
                   {/* --- ACTION BAR (BOTTOM) --- */}
                   <div className="absolute bottom-8 z-30 flex items-center gap-6">
                       {/* TRASH */}
                       <button onClick={(e) => {e.stopPropagation(); resetPizza();}} className="w-16 h-16 rounded-full bg-white border-4 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center shadow-lg transition-all hover:scale-110">
                           <Trash2 size={28} />
                       </button>

                       {/* STAGE ACTIONS */}
                       {pizzaStage === 'prep' && (
                           <button onClick={(e) => {e.stopPropagation(); handlePhaseTransition();}} className="h-20 px-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-2xl shadow-[0_8px_0_#065f46] active:translate-y-2 active:shadow-none hover:scale-105 transition-all flex items-center gap-3">
                               <Flame className="fill-orange-400 text-orange-400" /> {t.oven}
                           </button>
                       )}

                       {pizzaStage === 'baking' && (
                           <div className="flex flex-col items-center gap-4 bg-black/40 p-4 rounded-3xl backdrop-blur-md border border-white/10">
                               {/* Temperature Gauge */}
                               <div className="w-80 h-8 bg-gray-800 rounded-full border-2 border-gray-600 relative overflow-hidden shadow-inner">
                                   {/* Zones */}
                                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-green-500 to-red-600 opacity-50"></div>
                                   <div className="absolute left-[40%] w-[40%] h-full border-x-2 border-white/50 bg-green-400/30"></div>
                                   {/* Needle */}
                                   <div className="absolute top-0 h-full w-2 bg-white shadow-[0_0_10px_white] transition-all duration-100 ease-linear" style={{ left: `${ovenTemp}%` }}></div>
                               </div>
                               
                               {/* Controls */}
                               <div className="flex gap-4">
                                   <button 
                                     onMouseDown={() => setIsOvenOn(true)}
                                     onMouseUp={() => setIsOvenOn(false)}
                                     onMouseLeave={() => setIsOvenOn(false)}
                                     className={`h-16 px-8 rounded-full font-black text-xl shadow-[0_6px_0_#000] active:translate-y-1 active:shadow-none transition-all ${isOvenOn ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                                   >
                                       {isOvenOn ? <Flame className="animate-bounce" /> : <Play />} {t.ovenOn}
                                   </button>
                                   <button 
                                     onClick={(e) => {e.stopPropagation(); handlePhaseTransition();}}
                                     className="h-16 px-8 rounded-full bg-blue-600 text-white font-black text-xl shadow-[0_6px_0_#1e3a8a] active:translate-y-1 active:shadow-none hover:bg-blue-500 transition-all"
                                   >
                                       {t.pull}
                                   </button>
                               </div>
                               <div className="text-white font-mono text-xs tracking-widest uppercase">{bakeStatus === 'perfect' ? <span className="text-green-400 animate-pulse">{t.perfect}</span> : bakeStatus === 'burnt' ? <span className="text-red-500">{t.burnt}</span> : t.raw}</div>
                           </div>
                       )}

                       {pizzaStage === 'cutting' && (
                           <button onClick={(e) => {e.stopPropagation(); handlePhaseTransition();}} className="h-20 px-10 rounded-full bg-blue-500 text-white font-black text-xl shadow-[0_8px_0_#1e40af] active:translate-y-2 active:shadow-none hover:bg-blue-400 transition-all flex items-center gap-3">
                               <Box /> {t.box}
                           </button>
                       )}
                   </div>

                </div>

                {/* --- RIGHT: INGREDIENTS --- */}
                <div className={`w-64 bg-white border-l-4 border-gray-200 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar shadow-xl relative z-20 transition-transform duration-500 ${pizzaStage !== 'prep' ? 'translate-x-full' : 'translate-x-0'}`}>
                    <div className="text-gray-400 font-bold text-xs uppercase tracking-widest text-center mb-2">{t.toppings}</div>
                    <div className="grid grid-cols-2 gap-3">
                        {INGREDIENTS.map(ing => (
                            <button
                               key={ing.id}
                               onClick={() => setActiveTool(ing.id)}
                               className={`aspect-square rounded-2xl border-b-4 flex flex-col items-center justify-center transition-all hover:scale-105 active:border-b-0 active:translate-y-1
                                  ${activeTool === ing.id ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-400' : 'bg-gray-50 border-gray-200 hover:bg-white'}
                               `}
                            >
                                <span className="text-4xl mb-1 drop-shadow-sm">{ing.icon}</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">{ing.label[language === 'ru' ? 'ru' : 'en']}</span>
                            </button>
                        ))}
                    </div>
                </div>
            
            </div>
            )}

            {/* --- START SCREEN --- */}
            {gameState === 'start' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-amber-900/95 backdrop-blur-sm pointer-events-auto">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10 pointer-events-none"></div>
                    <div className="relative z-10 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="bg-white p-8 rounded-full w-48 h-48 mx-auto flex items-center justify-center shadow-2xl border-8 border-amber-500">
                           <ChefCharacter mood="happy" />
                        </div>
                        <div>
                            <h1 className="text-7xl font-black text-white italic drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">{t.title}</h1>
                        </div>
                        <button onClick={startGame} className="relative z-20 px-16 py-6 bg-green-500 text-white font-black text-3xl rounded-3xl shadow-[0_10px_0_#14532d] active:translate-y-2 active:shadow-none hover:bg-green-400 transition-all hover:scale-105 flex items-center gap-4 mx-auto">
                            <Play className="fill-white w-8 h-8" /> {t.start}
                        </button>
                    </div>
                </div>
            )}

            {/* --- END SCREEN --- */}
            {gameState === 'end' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg">
                    <div className="bg-white p-10 rounded-3xl text-center max-w-md w-full shadow-2xl border-8 border-gray-200 animate-in slide-in-from-bottom-10 duration-500">
                        <h2 className="text-4xl font-black text-gray-800 mb-2">{t.finish}</h2>
                        <div className="text-gray-500 font-mono text-sm mb-8 uppercase tracking-widest">{t.total}</div>
                        
                        <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100 mb-8">
                             <div className="text-6xl font-black text-green-600 drop-shadow-sm">${money}</div>
                             <div className="text-green-400 text-xs font-bold mt-2 uppercase">{t.tips} {t.included}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => onGameOver(money * 10)} className="py-4 bg-green-500 text-white font-bold rounded-xl shadow-[0_5px_0_#14532d] active:translate-y-1 active:shadow-none hover:bg-green-400 transition-all">
                                {t.claim}
                            </button>
                            <button onClick={startGame} className="py-4 bg-gray-200 text-gray-600 font-bold rounded-xl shadow-[0_5px_0_#9ca3af] active:translate-y-1 active:shadow-none hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                                <RotateCcw size={18} /> {t.restart}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
               @keyframes floatUp {
                 0% { opacity: 1; transform: translateY(0) scale(1); }
                 100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
               }
            `}</style>

        </div>
    </div>
  );
};

export default PizzaKitchen;
