
import React, { useRef, useState, useEffect } from 'react';
import { Language, PurchaseItem, InventoryItem, ShopItem } from '../types';
import { Gift, Lock, ShoppingBag, Star, Sparkles, Heart, Timer, Filter, Zap, Box, Check, ArrowRight, Package, Calendar, Store, QrCode, ScanLine, Crown, Bot, Sword, Shield, Ticket, HelpCircle, Info, Snowflake, Infinity, Moon, Sun, Bug, Radio, HeartHandshake, TrendingUp, Flame, Rocket, Ghost } from 'lucide-react';

interface RewardsStoreProps {
  userPoints: number;
  language: Language;
  onPurchase: (cost: number, itemName: string) => void;
  onRedeem: (code: string) => InventoryItem | null;
  history: PurchaseItem[];
  inventory: InventoryItem[];
  shopItems: ShopItem[];
}

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
type Category = 'all' | 'food' | 'discount' | 'special';

// --- RARITY CONFIG (Lighter & Brighter) ---
const RARITY_COLORS = {
  common: { 
    border: 'group-hover:border-slate-300', 
    text: 'text-slate-200', 
    bg: 'bg-slate-500/10', 
    shadow: 'group-hover:shadow-slate-400/40',
    badge: 'bg-slate-200/10 text-slate-200 border-slate-400/20'
  },
  rare: { 
    border: 'group-hover:border-cyan-400', 
    text: 'text-cyan-200', 
    bg: 'bg-cyan-500/10', 
    shadow: 'group-hover:shadow-cyan-400/50',
    badge: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/20'
  },
  epic: { 
    border: 'group-hover:border-fuchsia-400', 
    text: 'text-fuchsia-200', 
    bg: 'bg-fuchsia-500/10', 
    shadow: 'group-hover:shadow-fuchsia-400/50',
    badge: 'bg-fuchsia-400/10 text-fuchsia-200 border-fuchsia-400/20'
  },
  legendary: { 
    border: 'group-hover:border-amber-400', 
    text: 'text-amber-200', 
    bg: 'bg-amber-500/10', 
    shadow: 'group-hover:shadow-amber-400/60',
    badge: 'bg-amber-400/10 text-amber-200 border-amber-400/20'
  },
};

interface LootItem extends InventoryItem {
    availability: 'permanent' | 'seasonal';
}

// --- MOCK DATA FOR POSSIBLE DROPS ---
const POSSIBLE_LOOT: LootItem[] = [
  // PERMANENT - SKINS & PETS
  {
      id: 'loot1',
      name: { ru: 'Золотой Нож', en: 'Golden Cutter' },
      description: { ru: 'Легендарный скин. Авто-нарезка.', en: 'Legendary skin. Auto-slice.' },
      rarity: 'legendary',
      type: 'skin',
      image: 'dagger',
      obtainedAt: '',
      availability: 'permanent'
  },
  {
      id: 'loot2',
      name: { ru: 'Дрон-Доставщик', en: 'Delivery Drone' },
      description: { ru: 'Эпический питомец. +5% очков.', en: 'Epic pet. +5% points.' },
      rarity: 'epic',
      type: 'pet',
      image: 'drone',
      obtainedAt: '',
      availability: 'permanent'
  },
  
  // PERMANENT - BADGES
  {
      id: 'badge_speed',
      name: { ru: 'Спидстер', en: 'Speedster' },
      description: { ru: 'За самую быструю доставку.', en: 'For fastest delivery.' },
      rarity: 'rare',
      type: 'badge',
      image: 'speedster',
      obtainedAt: '',
      availability: 'permanent'
  },
  {
      id: 'badge_tycoon',
      name: { ru: 'Магнат Пиццы', en: 'Pizza Tycoon' },
      description: { ru: 'Накопил 1,000,000 очков.', en: 'Accumulated 1M points.' },
      rarity: 'legendary',
      type: 'badge',
      image: 'tycoon',
      obtainedAt: '',
      availability: 'permanent'
  },
  {
      id: 'badge_night',
      name: { ru: 'Ночная Сова', en: 'Night Owl' },
      description: { ru: 'Играл после 03:00.', en: 'Played after 3 AM.' },
      rarity: 'epic',
      type: 'badge',
      image: 'nightowl',
      obtainedAt: '',
      availability: 'permanent'
  },
  {
      id: 'badge_bug',
      name: { ru: 'Баг Хантер', en: 'Bug Hunter' },
      description: { ru: 'Нашел ошибку в игре.', en: 'Found a game bug.' },
      rarity: 'rare',
      type: 'badge',
      image: 'bughunter',
      obtainedAt: '',
      availability: 'permanent'
  },
  {
      id: 'badge_stream',
      name: { ru: 'Стример', en: 'Streamer' },
      description: { ru: 'Транслировал игру.', en: 'Streamed the game.' },
      rarity: 'epic',
      type: 'badge',
      image: 'streamer',
      obtainedAt: '',
      availability: 'permanent'
  },
  {
      id: 'badge_early',
      name: { ru: 'Ранняя Пташка', en: 'Early Bird' },
      description: { ru: 'Заказ до 10:00 утра.', en: 'Order before 10 AM.' },
      rarity: 'common',
      type: 'badge',
      image: 'earlybird',
      obtainedAt: '',
      availability: 'permanent'
  },
  {
      id: 'badge_hero',
      name: { ru: 'Герой Клуба', en: 'Club Hero' },
      description: { ru: 'Пригласил 10 друзей.', en: 'Invited 10 friends.' },
      rarity: 'legendary',
      type: 'badge',
      image: 'hero',
      obtainedAt: '',
      availability: 'permanent'
  },

  // SEASONAL (Winter / New Year)
  {
      id: 'loot_s_santa',
      name: { ru: 'Кибер Дед Мороз', en: 'Cyber Santa' },
      description: { ru: 'Взломал список плохих детей.', en: 'Hacked the naughty list.' },
      rarity: 'legendary',
      type: 'skin',
      image: 'santa',
      obtainedAt: '',
      availability: 'seasonal'
  },
  {
      id: 'loot_s_snowmaiden',
      name: { ru: 'Кибер Снегурочка', en: 'Cyber Snowmaiden' },
      description: { ru: 'Замораживает цены взглядом.', en: 'Freezes prices with a look.' },
      rarity: 'epic',
      type: 'skin',
      image: 'snowmaiden',
      obtainedAt: '',
      availability: 'seasonal'
  },
  {
      id: 'loot_s_horse',
      name: { ru: 'Огненная Лошадь 2026', en: 'Fire Horse 2026' },
      description: { ru: 'Символ будущего года. Скорость +26%.', en: 'Symbol of 2026. Speed +26%.' },
      rarity: 'legendary',
      type: 'pet',
      image: 'horse',
      obtainedAt: '',
      availability: 'seasonal'
  },
  {
      id: 'loot_s_sleigh',
      name: { ru: 'Неоновые Сани', en: 'Neon Sleigh' },
      description: { ru: 'Турбо-доставка подарков.', en: 'Turbo gift delivery.' },
      rarity: 'rare',
      type: 'pet',
      image: 'sleigh',
      obtainedAt: '',
      availability: 'seasonal'
  },
  {
      id: 'loot_s1',
      name: { ru: 'Ледяной Клинок', en: 'Frost Blade' },
      description: { ru: 'Замораживает пиццу при резке.', en: 'Freezes pizza on cut.' },
      rarity: 'epic',
      type: 'skin',
      image: 'dagger', 
      obtainedAt: '',
      availability: 'seasonal'
  },
  {
      id: 'loot_s2',
      name: { ru: 'Снеговик-Дрон', en: 'Snowman Drone' },
      description: { ru: 'Бросает снежки в духовку.', en: 'Throws snowballs at oven.' },
      rarity: 'rare',
      type: 'pet',
      image: 'drone',
      obtainedAt: '',
      availability: 'seasonal'
  },
];

// --- HELPERS ---
const getShopIcon = (iconType: string, size: string = "w-10 h-10") => {
    switch (iconType) {
        case 'food': return <ShoppingBag className={size} />;
        case 'drink': return <ShoppingBag className={size} />;
        case 'ticket': return <Gift className={size} />;
        case 'cheese': return <Heart className={size} />;
        case 'box': return <Box className={`${size} text-amber-300`} />;
        case 'star': return <Star className={size} />;
        default: return <Package className={size} />;
    }
};

// --- COMPONENTS ---

const RarityBadge = ({ rarity, language }: { rarity: Rarity, language: Language }) => {
  const colors = RARITY_COLORS[rarity];
  const label = {
      common: language === 'ru' ? 'ОБЫЧНОЕ' : 'COMMON',
      rare: language === 'ru' ? 'РЕДКОЕ' : 'RARE',
      epic: language === 'ru' ? 'ЭПИЧЕСКОЕ' : 'EPIC',
      legendary: language === 'ru' ? 'ЛЕГЕНДАРНОЕ' : 'LEGENDARY',
  }[rarity];

  return (
    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md transition-colors duration-300 ${colors.badge}`}>
      {label}
    </div>
  );
};

const PurchaseButton = ({ canAfford, cost, language, onClick, rarity }: { canAfford: boolean, cost: number, language: Language, onClick: () => void, rarity: Rarity }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canAfford) return;
        setIsClicked(true);
        onClick();
        setTimeout(() => setIsClicked(false), 800);
    }

    return (
        <button
            disabled={!canAfford}
            onClick={handleClick}
            className={`
                relative w-full py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] 
                flex items-center justify-center gap-2 overflow-hidden transition-all duration-300
                ${canAfford 
                    ? `bg-white text-black hover:scale-[1.02] active:scale-95 shadow-lg` 
                    : 'bg-slate-700/30 text-slate-500 cursor-not-allowed border border-white/5'}
                ${isClicked ? 'bg-green-400 text-white scale-95' : ''}
            `}
        >
            {/* Shimmer Effect */}
            {canAfford && !isClicked && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"></div>
            )}
            
            <div className="relative z-20 flex items-center gap-2">
                {isClicked ? <Check className="w-4 h-4 animate-bounce" /> : (canAfford ? (language === 'ru' ? 'КУПИТЬ' : 'BUY') : <Lock className="w-3 h-3" />)}
            </div>
        </button>
    )
}

const PhysicsCard = ({ item, userPoints, onBuy, language, index }: { item: ShopItem, userPoints: number, onBuy: any, language: Language, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const colors = RARITY_COLORS[item.rarity];
  const canAfford = userPoints >= item.cost;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Smoother tilt
    setRotate({ 
      x: ((y - centerY) / centerY) * -6, 
      y: ((x - centerX) / centerX) * 6 
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="perspective-1000 group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        ref={cardRef}
        onMouseMove={(e) => { setIsHovering(true); handleMouseMove(e); }}
        onMouseLeave={handleMouseLeave}
        className={`
            relative h-[360px] w-full rounded-3xl border transition-all duration-300 ease-out flex flex-col items-center justify-between p-6 overflow-hidden 
            bg-slate-800/40 backdrop-blur-md
            border-white/5 ${colors.border} ${colors.shadow}
            hover:bg-slate-800/60
        `}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovering ? 1.03 : 1}, ${isHovering ? 1.03 : 1}, 1)`,
          transition: 'transform 0.1s ease-out, background-color 0.3s, border-color 0.3s, box-shadow 0.3s'
        }}
      >
        {/* Light Sweep Effect */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`}></div>

        <RarityBadge rarity={item.rarity} language={language} />

        {/* Icon Container */}
        <div className="relative mt-6 z-10">
           <div className={`
                w-24 h-24 rounded-full flex items-center justify-center 
                ${colors.bg} border border-white/10 shadow-inner
                transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
           `}>
              <div className={`transform transition-all duration-500 ${isHovering ? 'scale-110 rotate-[15deg] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}`}>
                 {getShopIcon(item.iconType)}
              </div>
           </div>
           {item.rarity === 'legendary' && <Sparkles className="absolute -top-2 -right-2 text-amber-300 animate-spin-slow" />}
        </div>

        {/* Info */}
        <div className="text-center mt-4 z-10">
            <h3 className={`text-xl font-black italic mb-2 tracking-wide transition-colors ${isHovering ? 'text-white' : 'text-slate-200'}`}>
                {item.name[language]}
            </h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed px-4">
                {item.description[language]}
            </p>
        </div>

        {/* Action */}
        <div className="w-full mt-4 z-10">
            <div className={`flex justify-center items-center gap-2 mb-3 font-mono font-bold text-sm ${canAfford ? 'text-white' : 'text-red-400'}`}>
                <Zap className={`w-4 h-4 ${canAfford ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                {item.cost}
            </div>
            
            <PurchaseButton 
                canAfford={canAfford} 
                cost={item.cost} 
                language={language} 
                onClick={() => onBuy(item.cost, item.name[language])}
                rarity={item.rarity}
            />
        </div>
      </div>
    </div>
  );
};

const getLootIcon = (image: string, size: string = "w-12 h-12") => {
    // SPECIAL SEASONAL
    if (image === 'santa') return <Bot className={`${size} text-red-500`} />;
    if (image === 'snowmaiden') return <Sparkles className={`${size} text-cyan-300`} />;
    if (image === 'horse') return <Flame className={`${size} text-orange-500`} />;
    if (image === 'sleigh') return <Rocket className={`${size} text-blue-400`} />;

    // SKINS & PETS
    if (image === 'dagger') return <Sword className={`${size} text-amber-400`} />;
    if (image === 'drone') return <Bot className={`${size} text-purple-400`} />;
    if (image === 'ticket') return <Ticket className={`${size} text-pink-400`} />;
    
    // BADGES
    if (image === 'badge') return <Shield className={`${size} text-blue-400`} />;
    if (image === 'speedster') return <Zap className={`${size} text-yellow-400`} />;
    if (image === 'tycoon') return <Crown className={`${size} text-amber-500`} />;
    if (image === 'nightowl') return <Moon className={`${size} text-indigo-400`} />;
    if (image === 'bughunter') return <Bug className={`${size} text-green-400`} />;
    if (image === 'streamer') return <Radio className={`${size} text-red-500`} />;
    if (image === 'earlybird') return <Sun className={`${size} text-orange-400`} />;
    if (image === 'hero') return <HeartHandshake className={`${size} text-pink-500`} />;
    
    return <Package className={`${size} text-gray-400`} />;
};

const LootPreviewCard = ({ item, language, seasonal = false }: { item: LootItem, language: Language, seasonal?: boolean }) => {
    const colors = RARITY_COLORS[item.rarity];
    return (
        <div className={`
            relative flex flex-col items-center p-4 rounded-2xl border bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
            ${colors.border} hover:bg-slate-800 border-white/5
            ${seasonal ? 'ring-1 ring-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : ''}
        `}>
            {/* Rarity Line */}
            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-${item.rarity === 'legendary' ? 'amber' : item.rarity === 'epic' ? 'fuchsia' : 'cyan'}-500 to-transparent opacity-50`}></div>
            
            <div className={`w-16 h-16 rounded-full ${colors.bg} border border-white/5 flex items-center justify-center mb-3 shadow-lg`}>
                {getLootIcon(item.image, "w-8 h-8")}
            </div>
            
            <h4 className="text-white font-bold text-sm text-center leading-tight mb-1">{item.name[language]}</h4>
            <div className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 ${colors.text} flex items-center gap-1`}>
                {seasonal && <Snowflake className="w-3 h-3" />}
                {item.rarity}
            </div>
        </div>
    );
}

const InventoryCard = ({ item, language, index }: { item: InventoryItem, language: Language, index: number }) => {
    const colors = RARITY_COLORS[item.rarity];

    return (
        <div 
            className={`relative h-64 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center group hover:bg-slate-800 transition-all animate-in zoom-in duration-500`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Rarity BG Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-b from-transparent to-${item.rarity === 'legendary' ? 'amber' : item.rarity === 'epic' ? 'fuchsia' : 'cyan'}-500`}></div>
            
            <div className="absolute top-3 right-3">
                <RarityBadge rarity={item.rarity} language={language} />
            </div>

            <div className={`w-24 h-24 rounded-full ${colors.bg} border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {getLootIcon(item.image, "w-12 h-12")}
            </div>

            <h3 className="font-black italic text-white text-lg mb-1">{item.name[language]}</h3>
            <p className="text-xs text-gray-500 font-mono text-center px-4">{item.description[language]}</p>
            
            <div className="mt-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                {language === 'ru' ? 'ПОЛУЧЕНО:' : 'OBTAINED:'} {item.obtainedAt}
            </div>
        </div>
    )
}

const RewardsStore: React.FC<RewardsStoreProps> = ({ userPoints, language, onPurchase, onRedeem, history, inventory, shopItems }) => {
  const [filter, setFilter] = useState<Category>('all');
  const [viewMode, setViewMode] = useState<'market' | 'inventory' | 'codes'>('market');
  const [timeLeft, setTimeLeft] = useState('23:59:59');
  const [redeemCode, setRedeemCode] = useState('');
  const [newItem, setNewItem] = useState<InventoryItem | null>(null);

  // Mock Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = 23 - now.getHours();
      const m = 59 - now.getMinutes();
      const s = 59 - now.getSeconds();
      setTimeLeft(`${h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRedeem = () => {
      if (!redeemCode) return;
      const item = onRedeem(redeemCode);
      if (item) {
          setNewItem(item);
          setRedeemCode('');
          setTimeout(() => setNewItem(null), 5000);
      } else {
          alert(language === 'ru' ? 'Неверный код!' : 'Invalid code!');
      }
  };

  const filteredItems = shopItems.filter(i => filter === 'all' || i.category === filter);

  const t = {
    title: language === 'ru' ? 'КИБЕР МАРКЕТ' : 'CYBER MARKET',
    subtitle: language === 'ru' ? 'Трать очки - получай еду' : 'Spend points - Get food',
    balance: language === 'ru' ? 'БАЛАНС' : 'WALLET',
    refresh: language === 'ru' ? 'ОБНОВЛЕНИЕ:' : 'REFRESH:',
    live: language === 'ru' ? 'Магазин' : 'Live Store',
    system: language === 'ru' ? 'Система: Онлайн' : 'System: Online',
    tabs: {
        market: language === 'ru' ? 'МАГАЗИН' : 'MARKET',
        inventory: language === 'ru' ? 'ИНВЕНТАРЬ' : 'INVENTORY',
        codes: language === 'ru' ? 'ИСТОРИЯ' : 'HISTORY',
    },
    filter: {
        all: language === 'ru' ? 'ВСЕ' : 'ALL',
        food: language === 'ru' ? 'ЕДА' : 'FOOD',
        discount: language === 'ru' ? 'СКИДКИ' : 'OFFERS',
        special: language === 'ru' ? 'РЕДКОЕ' : 'SPECIAL',
    },
    emptyHistory: language === 'ru' ? 'Вы пока ничего не купили' : 'You haven\'t purchased anything yet',
    scanTitle: language === 'ru' ? 'АКТИВАЦИЯ КАРТЫ' : 'ACTIVATE CARD',
    scanDesc: language === 'ru' ? 'Введите код с QR-карты пиццы' : 'Enter code from pizza QR card',
    redeem: language === 'ru' ? 'АКТИВИРОВАТЬ' : 'ACTIVATE',
    placeholder: language === 'ru' ? 'НАПРИМЕР: LEGEND2025' : 'E.G. LEGEND2025',
    possible: language === 'ru' ? 'ВОЗМОЖНЫЕ НАГРАДЫ' : 'POSSIBLE DROPS',
    seasonal: language === 'ru' ? 'СЕЗОННЫЙ ЭКСКЛЮЗИВ' : 'SEASONAL EXCLUSIVE',
    permanent: language === 'ru' ? 'ПОСТОЯННАЯ КОЛЛЕКЦИЯ' : 'PERMANENT COLLECTION',
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-900/80 rounded-[3rem] border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl transition-all">
       
       {/* LIGHTER AMBIENT BACKGROUND */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
       </div>

       {/* HEADER HUD */}
       <div className="relative z-10 bg-gradient-to-b from-slate-900/50 to-transparent p-8 md:p-12 border-b border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
             
             {/* Title Block */}
             <div>
                <div className="flex items-center gap-3 mb-3">
                   <div className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(236,72,153,0.2)] flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                      </span>
                      {t.live}
                   </div>
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                   {t.title}
                </h2>
                <p className="text-slate-400 font-mono text-sm mt-2 flex items-center gap-2">
                   <ArrowRight className="w-4 h-4 text-pink-500" /> {t.subtitle}
                </p>
             </div>

             {/* Stats HUD (Lighter Glass) */}
             <div className="flex gap-4">
                {/* Wallet */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[180px] backdrop-blur-md group hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300">
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex justify-between items-center">
                      {t.balance} <div className="p-1 bg-yellow-500/20 rounded-full"><Zap className="w-3 h-3 text-yellow-400" /></div>
                   </div>
                   <div className="text-4xl font-mono font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                      {userPoints.toLocaleString()}
                   </div>
                </div>

                {/* Timer */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[160px] backdrop-blur-md hidden sm:block hover:bg-white/10 transition-colors">
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex justify-between items-center">
                      {t.refresh} <div className="p-1 bg-blue-500/20 rounded-full"><Timer className="w-3 h-3 text-blue-400" /></div>
                   </div>
                   <div className="text-3xl font-mono font-bold text-blue-300">
                      {timeLeft}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* TABS & CONTROLS */}
       <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-y border-white/5">
          <div className="px-8 md:px-12 py-4 flex flex-wrap gap-4 items-center justify-between">
             
             <div className="flex gap-2">
                 {/* View Mode Toggles */}
                 <button 
                    onClick={() => setViewMode('market')}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                        viewMode === 'market' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                 >
                    <Store className="w-4 h-4" /> {t.tabs.market}
                 </button>
                 <button 
                    onClick={() => setViewMode('inventory')}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                        viewMode === 'inventory' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                 >
                    <QrCode className="w-4 h-4" /> {t.tabs.inventory}
                 </button>
                 <button 
                    onClick={() => setViewMode('codes')}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                        viewMode === 'codes' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                 >
                    <Package className="w-4 h-4" /> {t.tabs.codes}
                 </button>
             </div>

             {viewMode === 'market' && (
                 <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 border-l border-white/10 pl-4 ml-4">
                    {[
                       { id: 'all', label: t.filter.all, icon: Filter },
                       { id: 'food', label: t.filter.food, icon: ShoppingBag },
                       { id: 'discount', label: t.filter.discount, icon: Gift },
                       { id: 'special', label: t.filter.special, icon: Star },
                    ].map((cat) => (
                       <button
                          key={cat.id}
                          onClick={() => setFilter(cat.id as Category)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                             filter === cat.id 
                             ? 'bg-white text-black scale-105' 
                             : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                          }`}
                       >
                          <cat.icon className="w-3 h-3" /> {cat.label}
                       </button>
                    ))}
                 </div>
             )}
             
             <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest hidden lg:block">
                {t.system}
             </div>
          </div>
       </div>

       {/* CONTENT AREA */}
       <div className="relative z-10 p-8 md:p-12 min-h-[600px]">
          {viewMode === 'market' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredItems.map((item, idx) => (
                    <PhysicsCard 
                       key={item.id} 
                       index={idx}
                       item={item} 
                       userPoints={userPoints} 
                       onBuy={onPurchase} 
                       language={language} 
                    />
                 ))}
              </div>
          ) : viewMode === 'inventory' ? (
              // INVENTORY & REDEMPTION VIEW
              <div className="max-w-5xl mx-auto space-y-12">
                  {/* REDEMPTION SCANNER */}
                  <div className="bg-gray-800/50 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none"></div>
                      
                      <div className="flex-1">
                          <h3 className="text-2xl font-black text-white italic mb-2">{t.scanTitle}</h3>
                          <p className="text-gray-400 text-sm">{t.scanDesc}</p>
                      </div>
                      
                      <div className="flex-1 w-full max-w-md relative">
                          <div className="relative flex items-center">
                              <ScanLine className="absolute left-4 text-gray-500 w-5 h-5" />
                              <input 
                                 type="text" 
                                 value={redeemCode}
                                 onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                                 placeholder={t.placeholder}
                                 className="w-full bg-black/40 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white font-mono font-bold tracking-wider focus:border-amber-500 outline-none transition-colors"
                              />
                              <button 
                                 onClick={handleRedeem}
                                 className="absolute right-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-lg transition-colors text-xs uppercase"
                              >
                                  {t.redeem}
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* POSSIBLE LOOT TABLE (NEW SPLIT) */}
                  <div className="space-y-8">
                      <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2"><HelpCircle className="w-5 h-5 text-amber-400" /> {t.possible}</h3>
                      
                      {/* SEASONAL SECTION */}
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4">
                              <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                  <Snowflake className="w-3 h-3" /> Limited Time
                              </div>
                          </div>
                          <h4 className="text-blue-300 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Snowflake className="w-4 h-4" /> {t.seasonal}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {POSSIBLE_LOOT.filter(i => i.availability === 'seasonal').map((loot) => (
                                  <LootPreviewCard key={loot.id} item={loot} language={language} seasonal />
                              ))}
                          </div>
                      </div>

                      {/* PERMANENT SECTION */}
                      <div>
                          <h4 className="text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Infinity className="w-4 h-4" /> {t.permanent}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {POSSIBLE_LOOT.filter(i => i.availability === 'permanent').map((loot) => (
                                  <LootPreviewCard key={loot.id} item={loot} language={language} />
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* NEW ITEM REVEAL OVERLAY */}
                  {newItem && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg animate-in fade-in duration-500">
                          <div className="text-center animate-in zoom-in duration-700">
                              <Crown className="w-32 h-32 text-yellow-400 mx-auto mb-6 animate-bounce drop-shadow-[0_0_30px_gold]" />
                              <h2 className="text-5xl font-black text-white mb-2">{newItem.name[language]}</h2>
                              <p className="text-xl text-amber-300 font-mono mb-8">{newItem.description[language]}</p>
                              <div className="px-6 py-3 bg-white/10 rounded-full text-sm font-bold text-white inline-block border border-white/20">
                                  RARITY: {newItem.rarity.toUpperCase()}
                              </div>
                          </div>
                      </div>
                  )}

                  {/* INVENTORY GRID */}
                  <div>
                      <h4 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-6">Your Collectibles</h4>
                      {inventory.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              {inventory.map((item, idx) => (
                                  <InventoryCard key={item.id} item={item} language={language} index={idx} />
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                              <QrCode className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                              <h3 className="text-xl font-bold text-slate-500">Inventory Empty</h3>
                              <p className="text-slate-600 mt-2">Scan a code to get your first item!</p>
                          </div>
                      )}
                  </div>
              </div>
          ) : (
              // HISTORY VIEW (OLD INVENTORY)
              <div className="max-w-4xl mx-auto">
                 {history.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {history.map((item, idx) => (
                            <div 
                                key={item.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-inner border border-white/5">
                                    <Package className="w-8 h-8 text-slate-300" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                                    <span className="text-[10px] font-mono text-green-400 border border-green-500/30 px-2 py-0.5 rounded bg-green-500/10">
                                        {language === 'ru' ? 'КУПЛЕНО' : 'OWNED'}
                                    </span>
                                    </div>
                                    <div className="flex gap-4 mt-1">
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {item.date}
                                    </div>
                                    <div className="text-xs text-yellow-500/80 flex items-center gap-1 font-mono">
                                        <Zap className="w-3 h-3" /> -{item.cost}
                                    </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                     <div className="text-center py-20">
                         <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                         <h3 className="text-xl font-bold text-slate-400">{t.emptyHistory}</h3>
                         <button onClick={() => setViewMode('market')} className="mt-4 text-pink-500 hover:underline font-bold text-sm">
                            {t.tabs.market}
                         </button>
                     </div>
                 )}
              </div>
          )}
       </div>

       <style>{`
         @keyframes shimmer {
           0% { transform: translateX(-100%); }
           100% { transform: translateX(100%); }
         }
       `}</style>

    </div>
  );
};

export default RewardsStore;
