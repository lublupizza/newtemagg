
import React, { useState, Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AuthModal from './components/AuthModal';
import MaintenanceScreen from './components/MaintenanceScreen';
import LaunchScreen from './components/LaunchScreen';
import DisabledGameScreen from './components/DisabledGameScreen';
import DisabledEventScreen from './components/DisabledEventScreen';
import ForkiEasterEgg from './components/ForkiEasterEgg';
import { AppView, User, Language, PurchaseItem, InventoryItem, Achievement, PromoItem, GamesConfig, ShopItem } from './types';
import { Loader2 } from 'lucide-react';

// --- LAZY LOAD HEAVY COMPONENTS FOR OPTIMIZATION ---
const GameZone = lazy(() => import('./components/GameZone'));
const Menu = lazy(() => import('./components/Menu'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const RewardsStore = lazy(() => import('./components/RewardsStore'));
const SeasonalEvent = lazy(() => import('./components/SeasonalEvent'));
const QuizGame = lazy(() => import('./components/QuizGame'));
const WheelFortune = lazy(() => import('./components/WheelFortune'));
const PuzzleGame = lazy(() => import('./components/PuzzleGame'));
const GlobalRankings = lazy(() => import('./components/GlobalRankings'));
const ScratchGame = lazy(() => import('./components/ScratchGame'));
const UserProfile = lazy(() => import('./components/UserProfile'));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [language, setLanguage] = useState<Language>('ru');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLaunchMode, setIsLaunchMode] = useState(false);
  const [isForkiOpen, setIsForkiOpen] = useState(false);
  
  // Games Status State
  const [gamesStatus, setGamesStatus] = useState<GamesConfig>({
      runner: true,
      jump: true,
      snake: true,
      stacker: true,
      kitchen: true,
      checkers: true,
      quiz: true,
      wheel: true,
      puzzle: true,
      scratch: true
  });

  // Seasonal Event Status
  const [isEventEnabled, setIsEventEnabled] = useState(true);

  // Start as Guest
  const [user, setUser] = useState<User>({
    id: 'guest',
    name: 'Guest',
    points: 0,
    rank: 'Novice'
  });
  
  // Track Purchase History & Inventory
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([
      { 
          id: 'starter_badge', 
          name: { ru: 'Новичок', en: 'Newbie Badge' }, 
          description: { ru: 'Знак отличия за регистрацию', en: 'Registration badge' }, 
          rarity: 'common', 
          type: 'badge', 
          image: 'badge', 
          obtainedAt: '2025-01-01',
          source: { ru: 'Регистрация в Клубе', en: 'Club Registration' }
      }
  ]);

  // Shop Items (Editable)
  const [shopItems, setShopItems] = useState<ShopItem[]>([
    { 
      id: 1, 
      name: { ru: 'Кока-Кола Зеро', en: 'Coca-Cola Zero' }, 
      description: { ru: 'Банка 0.33л, холодная', en: '0.33l Can, cold' }, 
      cost: 500, rarity: 'common', category: 'food', iconType: 'drink' 
    },
    { 
      id: 2, 
      name: { ru: 'Слайс Пепперони', en: 'Pepperoni Slice' }, 
      description: { ru: 'Один горячий кусочек', en: 'Single hot slice' }, 
      cost: 800, rarity: 'common', category: 'food', iconType: 'food' 
    },
    { 
      id: 3, 
      name: { ru: 'Скидка 20%', en: '20% Discount' }, 
      description: { ru: 'Одноразовый купон на заказ', en: 'One-time use coupon' }, 
      cost: 1500, rarity: 'rare', category: 'discount', iconType: 'ticket' 
    },
    { 
      id: 4, 
      name: { ru: 'Экстра Сыр', en: 'Extra Cheese' }, 
      description: { ru: 'Двойная порция сыра', en: 'Double cheese topping' }, 
      cost: 1200, rarity: 'rare', category: 'food', iconType: 'cheese' 
    },
    { 
      id: 5, 
      name: { ru: 'Тайный Бокс', en: 'Mystery Box' }, 
      description: { ru: 'Содержит случайный приз!', en: 'Contains Random Prize!' }, 
      cost: 3000, rarity: 'legendary', category: 'special', iconType: 'box' 
    },
    { 
      id: 6, 
      name: { ru: 'Комбо Обед', en: 'Combo Meal' }, 
      description: { ru: 'Пицца + Напиток + Соус', en: 'Pizza + Drink + Sauce' }, 
      cost: 5000, rarity: 'epic', category: 'food', iconType: 'star' 
    },
  ]);

  // Promo Banners State (Editable via Admin)
  const [heroPromos, setHeroPromos] = useState<PromoItem[]>([
    {
      id: 1,
      title: { ru: "КИБЕР УТРО", en: "CYBER MORNING" },
      desc: { ru: "С 10 до 12 х2 бонусов к заказам", en: "x2 bonuses from 10 to 12" },
      color: "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]",
      text: "text-cyan-400",
      bg: "from-cyan-900/60 to-blue-900/60",
      iconType: 'zap',
      delay: "0s",
      rotation: "-rotate-2"
    },
    {
      id: 2,
      title: { ru: "КОМБО GAME OVER", en: "GAME OVER COMBO" },
      desc: { ru: "Для сочных каток скидка 20%", en: "20% discount for juicy games" },
      color: "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
      text: "text-purple-400",
      bg: "from-purple-900/60 to-pink-900/60",
      iconType: 'gamepad',
      delay: "1.5s",
      rotation: "rotate-1"
    },
    {
      id: 3,
      title: { ru: "НОЧНОЙ ДОЖОР", en: "NIGHT MUNCHIES" },
      desc: { ru: "Выгодное предложение для ночных каток", en: "Best offer for night gaming" },
      color: "border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.3)]",
      text: "text-orange-400",
      bg: "from-orange-900/60 to-red-900/60",
      iconType: 'moon',
      delay: "0.8s",
      rotation: "rotate-2"
    }
  ]);

  // Mock Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
      { id: 'a1', title: { ru: 'Первый Укус', en: 'First Bite' }, desc: { ru: 'Сделать первый заказ', en: 'Make first order' }, icon: '🍕', unlocked: true, progress: 1, maxProgress: 1 },
      { id: 'a2', title: { ru: 'Игроман', en: 'Gamer' }, desc: { ru: 'Сыграть 50 раз', en: 'Play 50 times' }, icon: '🎮', unlocked: false, progress: 12, maxProgress: 50 },
      { id: 'a3', title: { ru: 'Коллекционер', en: 'Collector' }, desc: { ru: 'Собрать 5 легендарных предметов', en: 'Collect 5 legendary items' }, icon: '💎', unlocked: false, progress: 1, maxProgress: 5 },
      { id: 'a4', title: { ru: 'Шеф-Повар', en: 'Master Chef' }, desc: { ru: 'Приготовить идеальную пиццу', en: 'Cook a perfect pizza' }, icon: '👨‍🍳', unlocked: true, progress: 1, maxProgress: 1 },
  ]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'en' : 'ru');
  };

  const handleLogin = (newUser: User) => {
      setUser(newUser);
      setIsAuthOpen(false);
  };

  const handleScoreUpdate = (points: number) => {
    setUser(prev => ({ ...prev, points: prev.points + points }));
    const msg = language === 'ru' 
      ? `Отлично! Вы заработали ${points} очков!` 
      : `Awesome! You earned ${points} points!`;
    alert(msg);
  };
  
  const handleWin = (prize: string, value: number) => {
     if (value > 0) {
         handleScoreUpdate(value);
     } else if (value === 0) {
         const newItem: PurchaseItem = { id: Date.now().toString(), name: prize, cost: 0, date: new Date().toLocaleDateString() };
         setPurchaseHistory(prev => [newItem, ...prev]);
         alert(language === 'ru' ? `Вы выиграли предмет: ${prize}!` : `You won item: ${prize}!`);
     }
  };

  const handlePurchase = (cost: number, itemName: string) => {
      if (user.points >= cost) {
          setUser(prev => ({ ...prev, points: prev.points - cost }));
          const newItem: PurchaseItem = { id: Date.now().toString(), name: itemName, cost: cost, date: new Date().toLocaleDateString() };
          setPurchaseHistory(prev => [newItem, ...prev]);
          const msg = language === 'ru' ? `Успешно! Вы приобрели: ${itemName}` : `Success! You purchased: ${itemName}`;
          alert(msg);
      }
  };
  
  const handleScratchWin = (prize: string, type: 'bonus' | 'ornament') => {
     const newItem: PurchaseItem = { id: Date.now().toString(), name: prize, cost: 0, date: new Date().toLocaleDateString() };
     setPurchaseHistory(prev => [newItem, ...prev]);
     if (prize.includes('100')) {
         setUser(prev => ({ ...prev, points: prev.points + 100 }));
     }
     alert(language === 'ru' ? `Поздравляем! Вы выиграли: ${prize}. Проверьте инвентарь!` : `Congrats! You won: ${prize}. Check your inventory!`);
  };

  const handleRedeemCode = (code: string): InventoryItem | null => {
      if (code === 'LEGEND2025') {
          const newItem: InventoryItem = {
              id: Date.now().toString(),
              name: { ru: 'Золотой Нож', en: 'Golden Cutter' },
              description: { ru: 'Легендарный скин для игры. Режет пиццу сам.', en: 'Legendary skin. Slices pizza automatically.' },
              rarity: 'legendary',
              type: 'skin',
              image: 'dagger',
              obtainedAt: new Date().toLocaleDateString(),
              source: { ru: 'Промокод LEGEND2025', en: 'Promo Code LEGEND2025' }
          };
          setInventory(prev => [...prev, newItem]);
          return newItem;
      }
      if (code === 'PIZZABOT') {
          const newItem: InventoryItem = {
              id: Date.now().toString(),
              name: { ru: 'Дрон Доставщик', en: 'Delivery Drone' },
              description: { ru: 'Спутник в меню. Дает +5% к очкам.', en: 'Menu companion. Gives +5% points.' },
              rarity: 'epic',
              type: 'pet',
              image: 'drone',
              obtainedAt: new Date().toLocaleDateString(),
              source: { ru: 'QR Карта "Кибер-Пицца"', en: 'QR Card "Cyber-Pizza"' }
          };
          setInventory(prev => [...prev, newItem]);
          return newItem;
      }
      return null;
  };

  // MAINTENANCE & LAUNCH MODE CHECK
  if (currentView !== AppView.ADMIN) {
      if (isMaintenance) return <MaintenanceScreen />;
      if (isLaunchMode) return <LaunchScreen />;
  }

  // Loading Fallback for Lazy Components
  const LoadingView = () => (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-900">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <>
            <Hero onNavigate={setCurrentView} onAuth={() => setIsAuthOpen(true)} language={language} user={user} promos={heroPromos} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<LoadingView />}>
                    <Menu language={language} />
                </Suspense>
            </div>
          </>
        );
      case AppView.GAMES:
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Suspense fallback={<LoadingView />}>
                <GameZone onScoreUpdate={handleScoreUpdate} language={language} gamesStatus={gamesStatus} />
            </Suspense>
          </div>
        );
      case AppView.QUIZ:
        if (!gamesStatus.quiz) return <div className="max-w-4xl mx-auto px-4 py-12 min-h-[600px] relative"><DisabledGameScreen title={language === 'ru' ? 'ВИКТОРИНА' : 'QUIZ'} language={language} /></div>;
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
             <Suspense fallback={<LoadingView />}>
                <QuizGame language={language} onComplete={handleScoreUpdate} />
             </Suspense>
          </div>
        );
      case AppView.WHEEL:
        if (!gamesStatus.wheel) return <div className="max-w-4xl mx-auto px-4 py-12 min-h-[600px] relative"><DisabledGameScreen title={language === 'ru' ? 'КОЛЕСО ФОРТУНЫ' : 'WHEEL OF FORTUNE'} language={language} /></div>;
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
             <Suspense fallback={<LoadingView />}>
                <WheelFortune language={language} onWin={handleWin} />
             </Suspense>
          </div>
        );
      case AppView.PUZZLE:
        if (!gamesStatus.puzzle) return <div className="max-w-4xl mx-auto px-4 py-12 min-h-[600px] relative"><DisabledGameScreen title={language === 'ru' ? 'ПАЗЛЫ' : 'PUZZLE'} language={language} /></div>;
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
             <Suspense fallback={<LoadingView />}>
                <PuzzleGame language={language} onComplete={handleScoreUpdate} />
             </Suspense>
          </div>
        );
      case AppView.SCRATCH:
        if (!gamesStatus.scratch) return <div className="max-w-4xl mx-auto px-4 py-12 min-h-[600px] relative"><DisabledGameScreen title={language === 'ru' ? 'СЧАСТЛИВАЯ КАРТА' : 'SCRATCH CARD'} language={language} /></div>;
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
             <Suspense fallback={<LoadingView />}>
                <ScratchGame language={language} onWin={handleScratchWin} />
             </Suspense>
          </div>
        );
      case AppView.SEASONAL:
        if (!isEventEnabled) return <div className="max-w-4xl mx-auto px-4 py-12 min-h-[600px] relative"><DisabledEventScreen language={language} /></div>;
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
             <Suspense fallback={<LoadingView />}>
                <SeasonalEvent language={language} userPoints={user.points} onPurchase={handlePurchase} onBack={() => setCurrentView(AppView.HOME)} />
             </Suspense>
          </div>
        );
      case AppView.SHOP:
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
             <Suspense fallback={<LoadingView />}>
                <RewardsStore 
                    userPoints={user.points} 
                    language={language} 
                    onPurchase={handlePurchase} 
                    history={purchaseHistory} 
                    inventory={inventory} 
                    onRedeem={handleRedeemCode}
                    shopItems={shopItems}
                />
             </Suspense>
          </div>
        );
      case AppView.MENU:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<LoadingView />}>
                  <Menu language={language} />
              </Suspense>
          </div>
        );
      case AppView.RANKINGS:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<LoadingView />}>
                  <GlobalRankings language={language} />
              </Suspense>
          </div>
        );
      case AppView.ADMIN:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<LoadingView />}>
                <AdminDashboard 
                language={language} 
                heroPromos={heroPromos}
                setHeroPromos={setHeroPromos}
                isMaintenance={isMaintenance}
                setMaintenance={setIsMaintenance}
                isLaunchMode={isLaunchMode}
                setLaunchMode={setIsLaunchMode}
                gamesStatus={gamesStatus}
                setGamesStatus={setGamesStatus}
                isEventEnabled={isEventEnabled}
                setEventEnabled={setIsEventEnabled}
                shopItems={shopItems}
                setShopItems={setShopItems}
                />
            </Suspense>
          </div>
        );
      case AppView.PROFILE:
        return (
          <Suspense fallback={<LoadingView />}>
              <UserProfile user={user} inventory={inventory} language={language} achievements={achievements} />
          </Suspense>
        );
      default:
        return <Hero onNavigate={setCurrentView} onAuth={() => setIsAuthOpen(true)} language={language} user={user} promos={heroPromos} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-pink-500 selection:text-white flex flex-col">
      {((!isMaintenance && !isLaunchMode) || currentView === AppView.ADMIN) && (
          <Header currentView={currentView} onChangeView={setCurrentView} user={user} language={language} onToggleLanguage={toggleLanguage} onOpenAuth={() => setIsAuthOpen(true)} />
      )}
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} language={language} />
      
      {/* FORKI EASTER EGG MODAL */}
      {isForkiOpen && <ForkiEasterEgg onClose={() => setIsForkiOpen(false)} />}

      <main className="fade-in-up flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col">
        {renderView()}
      </main>

      {((!isMaintenance && !isLaunchMode) || currentView === AppView.ADMIN) && (
          <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-24">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
              <p className="font-retro mb-4 text-lg text-gray-400">ЛюблюPizzaClub</p>
              <p className="text-sm font-mono uppercase tracking-wider">
                  2025 Курск. Центр Инноваций Пиццы. prod. by {' '}
                  <span 
                    onClick={() => setIsForkiOpen(true)} 
                    className="text-pink-500 font-bold cursor-pointer hover:text-white hover:underline transition-colors"
                  >
                    ForkiStyle
                  </span>
              </p>
            </div>
          </footer>
      )}
    </div>
  );
};

export default App;
