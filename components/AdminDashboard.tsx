
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Legend
} from 'recharts';
import { 
  Wallet, Users, Zap, PieChart as PieIcon, Download, Upload, Bell, Target, Layers, 
  Search, Filter, ChevronRight, Save, FileSpreadsheet, Share2, User, Clock, ShoppingCart, 
  Gamepad2, Trophy, AlertTriangle, Server, Activity, Terminal, Palette, Settings, 
  Megaphone, Eye, MousePointer, GitBranch, Cpu, Globe, Shield, Database, FileText, 
  RefreshCw, Plus, Trash, Lock, Archive, Image as ImageIcon, HardDrive, Wrench,
  Power, CloudOff, RotateCcw, AlertOctagon, HardDriveDownload, Play, Pause,
  UserX, TrendingDown, TrendingUp, Gauge, Calendar, CheckCircle2, ToggleLeft, ToggleRight, History,
  Gift, Medal, Crown, Star, Ticket, KeyRound, ShieldCheck, AlertCircle, ArrowRight, Layout, Moon,
  Smartphone, Monitor, ArrowDownRight, Timer, Radio, Rocket, Snowflake, DollarSign, UserCheck, BarChart3, Edit3, SaveAll, RefreshCcw, ShoppingBag, Heart, Box
} from 'lucide-react';
import { Language, PromoItem, GamesConfig, GameId, ShopItem } from '../types';

// --- MOCK DATA ---
const OVERVIEW_TRENDS = [
  { date: '01.12', revenue: 45000, spend: 12000, orders: 45 },
  { date: '05.12', revenue: 52000, spend: 15000, orders: 52 },
  { date: '10.12', revenue: 48000, spend: 11000, orders: 49 },
  { date: '15.12', revenue: 61000, spend: 18000, orders: 65 },
  { date: '20.12', revenue: 85000, spend: 25000, orders: 92 },
  { date: '25.12', revenue: 98000, spend: 22000, orders: 105 },
  { date: '30.12', revenue: 115000, spend: 24000, orders: 128 },
];

const CAMPAIGNS_DATA = [
  { id: 1, name: "Новогодний Буст", platform: "VK Ads", status: "active", budget: 50000, spent: 32000, clicks: 1200, ctr: "2.4%", cpc: 26.6, roas: "3.5x" },
  { id: 2, name: "Ретаргет (Корзина)", platform: "Yandex", status: "active", budget: 30000, spent: 15000, clicks: 450, ctr: "1.8%", cpc: 33.3, roas: "5.2x" },
  { id: 3, name: "Геймерская Ночь", platform: "Telegram", status: "paused", budget: 10000, spent: 10000, clicks: 800, ctr: "4.1%", cpc: 12.5, roas: "2.1x" },
];

const FUNNEL_DATA = [
  { stage: 'Visit (Посетители)', count: 15000, drop: 0, fill: '#3b82f6' },
  { stage: 'Registration (Рега)', count: 4500, drop: 70, fill: '#8b5cf6' },
  { stage: 'Game Played (Играли)', count: 3800, drop: 15, fill: '#ec4899' },
  { stage: 'Add to Cart (Корзина)', count: 2100, drop: 45, fill: '#f59e0b' },
  { stage: 'Purchase (Заказ)', count: 1800, drop: 14, fill: '#10b981' },
];

const SEGMENT_USERS = [
  { id: 'u_1', name: 'Alex_Killer', phone: '+7 (999) ***-**-21', orders: 12, totalSpent: 15000, lastSeen: '2h ago', status: 'active' },
  { id: 'u_2', name: 'PizzaLover', phone: '+7 (912) ***-**-55', orders: 5, totalSpent: 4500, lastSeen: '1d ago', status: 'active' },
  { id: 'u_3', name: 'GhostUser', phone: '+7 (905) ***-**-00', orders: 0, totalSpent: 0, lastSeen: '30d ago', status: 'inactive' },
  { id: 'u_4', name: 'RichGuy', phone: '+7 (920) ***-**-99', orders: 45, totalSpent: 85000, lastSeen: '5m ago', status: 'vip' },
];

// --- TYPES ---
interface AdminDashboardProps {
  language: Language;
  heroPromos?: PromoItem[];
  setHeroPromos?: React.Dispatch<React.SetStateAction<PromoItem[]>>;
  isMaintenance: boolean;
  setMaintenance: (val: boolean) => void;
  isLaunchMode: boolean;
  setLaunchMode: (val: boolean) => void;
  gamesStatus: GamesConfig;
  setGamesStatus: React.Dispatch<React.SetStateAction<GamesConfig>>;
  isEventEnabled: boolean;
  setEventEnabled: (val: boolean) => void;
  shopItems: ShopItem[];
  setShopItems: React.Dispatch<React.SetStateAction<ShopItem[]>>;
}

type Role = 'marketing' | 'sysadmin';
type MarketingView = 'overview' | 'campaigns' | 'segments' | 'funnels' | 'rewards';
type SysAdminView = 'health' | 'themes' | 'logs' | 'features' | 'backup' | 'content' | 'maintenance';

const SidebarItem = ({ active, onClick, icon: Icon, label }: any) => (
    <button 
       onClick={onClick}
       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-bold text-sm tracking-wide">{label}</span>
    </button>
);

// ... (Keep MarketingOverview, MarketingCampaigns, MarketingFunnels, MarketingSegments, MarketingRewards components as is) ...
// --- MARKETING COMPONENTS ---

const MarketingOverview = ({ language }: { language: Language }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg"><DollarSign className="w-5 h-5 text-green-500" /></div>
                        <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">+12%</span>
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">ROAS</div>
                    <div className="text-2xl font-black text-white">450%</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg"><Users className="w-5 h-5 text-blue-500" /></div>
                        <span className="text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">-5%</span>
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">CAC (Стоимость клиента)</div>
                    <div className="text-2xl font-black text-white">350 ₽</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-500" /></div>
                        <span className="text-purple-500 text-xs font-bold bg-purple-500/10 px-2 py-1 rounded">+8%</span>
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">LTV (Пожизненная ценность)</div>
                    <div className="text-2xl font-black text-white">12,500 ₽</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-orange-500/20 rounded-lg"><UserX className="w-5 h-5 text-orange-500" /></div>
                        <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">-2%</span>
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Churn Rate (Отток)</div>
                    <div className="text-2xl font-black text-white">4.2%</div>
                </div>
            </div>

            {/* MAIN CHART */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="text-pink-500" /> {language === 'ru' ? 'Эффективность Маркетинга' : 'Marketing Efficiency'}
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={OVERVIEW_TRENDS}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" />
                            <YAxis yAxisId="left" stroke="#666" />
                            <YAxis yAxisId="right" orientation="right" stroke="#666" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="revenue" name="Выручка" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Line yAxisId="left" type="monotone" dataKey="spend" name="Затраты на рекламу" stroke="#ef4444" strokeWidth={3} />
                            <Area yAxisId="right" type="monotone" dataKey="orders" name="Заказы (шт)" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.1} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const MarketingCampaigns = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Megaphone className="text-blue-500" /> Активные Кампании
                        </h3>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <Plus className="w-3 h-3" /> Создать
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-950 text-xs uppercase font-bold text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Кампания</th>
                                    <th className="px-6 py-4">Платформа</th>
                                    <th className="px-6 py-4">Статус</th>
                                    <th className="px-6 py-4">Бюджет</th>
                                    <th className="px-6 py-4">Потрачено</th>
                                    <th className="px-6 py-4">CTR</th>
                                    <th className="px-6 py-4">CPC</th>
                                    <th className="px-6 py-4">ROAS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {CAMPAIGNS_DATA.map((camp) => (
                                    <tr key={camp.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{camp.name}</td>
                                        <td className="px-6 py-4">{camp.platform}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${camp.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {camp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{camp.budget.toLocaleString()} ₽</td>
                                        <td className="px-6 py-4 text-white">{camp.spent.toLocaleString()} ₽</td>
                                        <td className="px-6 py-4">{camp.ctr}</td>
                                        <td className="px-6 py-4">{camp.cpc} ₽</td>
                                        <td className="px-6 py-4 font-bold text-green-400">{camp.roas}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MarketingFunnels = ({ language }: { language: Language }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Filter className="text-purple-500" /> {language === 'ru' ? 'Воронка Конверсии' : 'Conversion Funnel'}
                </h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={FUNNEL_DATA} 
                            layout="vertical" 
                            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                            <XAxis type="number" stroke="#666" />
                            <YAxis dataKey="stage" type="category" width={150} stroke="#fff" fontSize={12} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            />
                            <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={40}>
                                {FUNNEL_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 grid grid-cols-5 gap-4 text-center">
                    {FUNNEL_DATA.map((step, i) => (
                        <div key={i} className="bg-gray-800 p-3 rounded-xl">
                            <div className="text-[10px] text-gray-500 uppercase mb-1">{step.stage.split('(')[0]}</div>
                            <div className="text-lg font-bold text-white">{step.count}</div>
                            {i > 0 && (
                                <div className="text-xs text-red-400 mt-1">-{step.drop}%</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MarketingSegments = ({ language }: { language: Language }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const handleExport = () => {
        alert(language === 'ru' ? 'Экспорт базы номеров в Excel начался...' : 'Exporting phone numbers to Excel...');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Audience Stats Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-indigo-400 w-6 h-6" />
                        <span className="text-indigo-200 font-bold uppercase text-xs tracking-wider">Всего регистраций</span>
                    </div>
                    <div className="text-4xl font-black text-white">12,450</div>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-green-400 w-6 h-6" />
                        <span className="text-green-200 font-bold uppercase text-xs tracking-wider">DAU (Сегодня играли)</span>
                    </div>
                    <div className="text-4xl font-black text-white">1,200</div>
                </div>
                <div className="bg-pink-900/20 border border-pink-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-pink-400 w-6 h-6" />
                        <span className="text-pink-200 font-bold uppercase text-xs tracking-wider">MAU (За месяц)</span>
                    </div>
                    <div className="text-4xl font-black text-white">8,500</div>
                </div>
            </div>

            {/* Segmentation Tool */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="text-amber-500" /> {language === 'ru' ? 'Сегментация и Экспорт' : 'Segmentation & Export'}
                    </h3>
                    <div className="flex gap-2">
                        {['all', 'vip', 'active', 'inactive'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${activeFilter === f ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                            >
                                {f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleExport}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                    >
                        <FileSpreadsheet className="w-4 h-4" /> {language === 'ru' ? 'Скачать Excel (.xlsx)' : 'Download Excel'}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-950 text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Пользователь</th>
                                <th className="px-6 py-4">Телефон</th>
                                <th className="px-6 py-4">Заказов</th>
                                <th className="px-6 py-4">Потрачено</th>
                                <th className="px-6 py-4">Был в сети</th>
                                <th className="px-6 py-4">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {SEGMENT_USERS.filter(u => activeFilter === 'all' || u.status === activeFilter).map((user) => (
                                <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                                    <td className="px-6 py-4 font-mono">{user.phone}</td>
                                    <td className="px-6 py-4">{user.orders}</td>
                                    <td className="px-6 py-4">{user.totalSpent.toLocaleString()} ₽</td>
                                    <td className="px-6 py-4">{user.lastSeen}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold 
                                            ${user.status === 'vip' ? 'bg-amber-500/10 text-amber-500' : user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MarketingRewards = ({ language }: { language: Language }) => {
    const [targetType, setTargetType] = useState<'user' | 'rank' | 'all'>('user');
    const [targetRank, setTargetRank] = useState<'top10' | 'top100'>('top10');
    const [userId, setUserId] = useState('');
    const [rewardType, setRewardType] = useState('points');
    const [amount, setAmount] = useState(100);
    const [selectedBadge, setSelectedBadge] = useState('badge_speed');

    const handleSend = () => {
        const targetText = targetType === 'user' ? `User ${userId}` : targetType === 'rank' ? `Rank ${targetRank}` : "ALL USERS";
        const rewardText = rewardType === 'points' ? `${amount} pts` : `Badge: ${selectedBadge}`;
        
        if (targetType === 'all') {
            if (confirm(`ВНИМАНИЕ! Вы собираетесь отправить ${rewardText} ВСЕМ ИГРОКАМ. Продолжить?`)) {
                alert(`Массовая рассылка: ${rewardText} успешно отправлена!`);
            }
        } else {
            alert(`Отправлено ${targetText}: ${rewardText}`);
        }
    };

    const BADGES = [
        { id: 'badge_speed', name: 'Спидстер' },
        { id: 'badge_tycoon', name: 'Магнат' },
        { id: 'badge_night', name: 'Ночная Сова' },
        { id: 'badge_bug', name: 'Баг Хантер' },
        { id: 'badge_stream', name: 'Стример' },
        { id: 'badge_early', name: 'Ранняя Пташка' },
        { id: 'badge_hero', name: 'Герой' },
        { id: 'loot_s_santa', name: 'Дед Мороз' },
        { id: 'loot_s_horse', name: 'Лошадь 2026' },
        { id: 'starter_badge', name: 'Новичок' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manual Issue */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Gift className="text-pink-500" /> {language === 'ru' ? 'Выдача Наград' : 'Issue Rewards'}
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Target Selector */}
                        <div>
                            <label className="block text-gray-400 text-sm mb-3 font-bold uppercase tracking-wider">Кому отправить?</label>
                            <div className="flex gap-2 bg-black p-1 rounded-lg mb-4">
                                <button onClick={() => setTargetType('user')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-colors ${targetType === 'user' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>По ID</button>
                                <button onClick={() => setTargetType('rank')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-colors ${targetType === 'rank' ? 'bg-yellow-600 text-white' : 'text-gray-500'}`}>Рейтинг</button>
                                <button onClick={() => setTargetType('all')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-colors ${targetType === 'all' ? 'bg-red-600 text-white' : 'text-gray-500'}`}>ВСЕМ</button>
                            </div>

                            {targetType === 'user' && (
                                <input 
                                    type="text" 
                                    placeholder="ID пользователя (например: u_123)" 
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white mb-4"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            )}

                            {targetType === 'rank' && (
                                <select 
                                    value={targetRank}
                                    onChange={(e) => setTargetRank(e.target.value as any)}
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white mb-4"
                                >
                                    <option value="top10">Топ 10 (Лучшие)</option>
                                    <option value="top100">Топ 100 (Активные)</option>
                                </select>
                            )}

                            {targetType === 'all' && (
                                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <span className="text-xs text-red-300 font-bold">Награда будет начислена всем 12,450 пользователям!</span>
                                </div>
                            )}
                        </div>

                        {/* Reward Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setRewardType('points')}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${rewardType === 'points' ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 bg-gray-800'}`}
                            >
                                <Zap className={`w-6 h-6 mx-auto mb-2 ${rewardType === 'points' ? 'text-yellow-500' : 'text-gray-500'}`} />
                                <div className="text-xs font-bold uppercase">Баллы</div>
                            </button>
                            <button 
                                onClick={() => setRewardType('badge')}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${rewardType === 'badge' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800'}`}
                            >
                                <Medal className={`w-6 h-6 mx-auto mb-2 ${rewardType === 'badge' ? 'text-blue-500' : 'text-gray-500'}`} />
                                <div className="text-xs font-bold uppercase">Значок</div>
                            </button>
                        </div>

                        {/* Value Input */}
                        {rewardType === 'points' ? (
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 font-bold">Количество</label>
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white font-mono font-bold text-lg"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 font-bold">Выберите значок</label>
                                <select 
                                    value={selectedBadge}
                                    onChange={(e) => setSelectedBadge(e.target.value)}
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white"
                                >
                                    {BADGES.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button 
                            onClick={handleSend}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] ${targetType === 'all' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'}`}
                        >
                            {language === 'ru' ? 'ОТПРАВИТЬ НАГРАДУ' : 'SEND REWARD'}
                        </button>
                    </div>
                </div>

                {/* Seasonal Config */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar className="text-blue-500" /> {language === 'ru' ? 'Настройки Сезона' : 'Season Config'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-300">Топ 1 (Легенда)</span>
                                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Авто-выдача</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Награда в конце месяца</p>
                            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white">
                                <option>3000 Баллов + Значок "Король"</option>
                                <option>Промокод на пиццу + 5000 Баллов</option>
                            </select>
                        </div>

                        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-300">Топ 10 (Элита)</span>
                                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Авто-выдача</span>
                            </div>
                            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white">
                                <option>1000 Баллов + Значок "Элита"</option>
                                <option>Скидка 50% на заказ</option>
                            </select>
                        </div>

                        <button className="w-full py-3 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">
                            СОХРАНИТЬ КОНФИГУРАЦИЮ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SYSADMIN COMPONENTS ---

// ... (Keep SysAdminMissionControl, SysAdminLogs, SysAdminBackup, SysAdminMaintenance, SysAdminThemes, SysAdminFeatures as they are) ...
const SysAdminMissionControl = ({ language, isMaintenance, setMaintenance }: { language: Language, isMaintenance: boolean, setMaintenance: (v: boolean) => void }) => {
    const handleAction = (action: string) => {
        alert(language === 'ru' ? `Выполнено: ${action}` : `Executed: ${action}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <button onClick={() => handleAction('Clear Cache')} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center gap-2 transition-colors">
                    <RotateCcw className="w-6 h-6 text-blue-400" />
                    <span className="text-xs font-bold text-gray-300">Очистить Кэш</span>
                </button>
                <button onClick={() => handleAction('Restart PHP')} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center gap-2 transition-colors">
                    <RefreshCw className="w-6 h-6 text-green-400" />
                    <span className="text-xs font-bold text-gray-300">Рестарт PHP</span>
                </button>
                <button onClick={() => handleAction('Reboot Server')} className="bg-gray-800 hover:bg-red-900/50 p-4 rounded-xl flex flex-col items-center gap-2 transition-colors group">
                    <Power className="w-6 h-6 text-red-500 group-hover:text-white" />
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white">Ребут Сервера</span>
                </button>
                <button 
                    onClick={() => setMaintenance(!isMaintenance)} 
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-colors ${isMaintenance ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                    <AlertOctagon className={`w-6 h-6 ${isMaintenance ? 'text-white' : 'text-orange-400'}`} />
                    <span className="text-xs font-bold text-gray-300">{isMaintenance ? 'ВЫКЛ ТЕХ.РЕЖИМ' : 'ВКЛ ТЕХ.РЕЖИМ'}</span>
                </button>
                <button onClick={() => handleAction('Instant Backup')} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center gap-2 transition-colors">
                    <Save className="w-6 h-6 text-purple-400" />
                    <span className="text-xs font-bold text-gray-300">Бэкап Сейчас</span>
                </button>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/40 border border-green-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-xs text-green-400 uppercase font-bold">Онлайн</div>
                        <div className="text-2xl font-black text-white">487</div>
                    </div>
                    <Globe className="w-8 h-8 text-green-500/50" />
                </div>
                <div className="bg-black/40 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-xs text-blue-400 uppercase font-bold">Активные Заказы</div>
                        <div className="text-2xl font-black text-white">23</div>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-500/50" />
                </div>
                <div className="bg-black/40 border border-yellow-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-xs text-yellow-400 uppercase font-bold">Курьеры</div>
                        <div className="text-2xl font-black text-white">12</div>
                    </div>
                    <Rocket className="w-8 h-8 text-yellow-500/50" />
                </div>
                <div className="bg-black/40 border border-purple-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-xs text-purple-400 uppercase font-bold">Заказов/мин</div>
                        <div className="text-2xl font-black text-white">4.2</div>
                    </div>
                    <Gauge className="w-8 h-8 text-purple-500/50" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Critical Logs */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-red-500 w-5 h-5" /> Критические События
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                            <span className="text-red-300">Ошибка оплаты #44532</span>
                            <span className="text-xs text-gray-500 font-mono">14:32</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                            <span className="text-yellow-300">Курьер #7 пропал с радара</span>
                            <span className="text-xs text-gray-500 font-mono">14:28</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-3 bg-gray-800 rounded-lg">
                            <span className="text-gray-300">Пользователь X снял 5000 монет вручную</span>
                            <span className="text-xs text-gray-500 font-mono">14:15</span>
                        </div>
                    </div>
                </div>

                {/* Performance */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="text-blue-500 w-5 h-5" /> Топ Медленных Страниц
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300 font-mono">/constructor</span>
                            <div className="flex items-center gap-4">
                                <span className="text-red-400 font-bold text-sm">4.8 сек</span>
                                <button className="text-[10px] bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white">Оптимизировать</button>
                            </div>
                        </div>
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-red-500"></div></div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300 font-mono">/order/pay</span>
                            <div className="flex items-center gap-4">
                                <span className="text-yellow-400 font-bold text-sm">2.1 сек</span>
                                <button className="text-[10px] bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white">Оптимизировать</button>
                            </div>
                        </div>
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="w-[40%] h-full bg-yellow-500"></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SysAdminLogs = () => {
    const [logs, setLogs] = useState<string[]>([
        "[INFO] Server started on port 3000",
        "[INFO] Database connection established",
        "[WARN] High latency on redis_cache_01",
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const endpoints = ['/api/v1/orders', '/auth/login', '/api/v1/games/score', '/static/assets'];
            const statuses = ['200 OK', '200 OK', '200 OK', '500 ERROR', '404 NOT FOUND'];
            const ep = endpoints[Math.floor(Math.random() * endpoints.length)];
            const st = statuses[Math.floor(Math.random() * statuses.length)];
            const time = new Date().toLocaleTimeString();
            
            const newLog = `[${time}] ${st.includes('ERROR') ? '[ERROR]' : '[INFO]'} Request to ${ep} - ${st}`;
            setLogs(prev => [newLog, ...prev].slice(0, 20));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black border border-gray-800 rounded-xl p-4 font-mono text-xs text-green-400 h-[500px] overflow-y-auto shadow-inner">
            {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('ERROR') ? 'text-red-500' : log.includes('WARN') ? 'text-yellow-500' : 'text-green-400'}`}>
                    {log}
                </div>
            ))}
        </div>
    );
};

const SysAdminBackup = ({ language }: { language: Language }) => {
    const BACKUPS = [
        { id: 1, date: '12.01.2025 03:00', day: 'Воскресенье', size: '1.2 GB', type: 'Auto' },
        { id: 2, date: '11.01.2025 03:00', day: 'Суббота', size: '1.1 GB', type: 'Auto' },
        { id: 3, date: '10.01.2025 15:30', day: 'Пятница', size: '1.1 GB', type: 'Manual' },
        { id: 4, date: '10.01.2025 03:00', day: 'Пятница', size: '1.0 GB', type: 'Auto' },
    ];

    const handleRestore = () => {
        if (confirm('Вы уверены? Текущие данные будут перезаписаны.')) {
            alert('Восстановление запущено...');
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database className="text-blue-500" /> {language === 'ru' ? 'Резервные Копии' : 'Backups'}
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 uppercase">Авто-бэкап</span>
                        <ToggleRight className="w-8 h-8 text-green-500 cursor-pointer" />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Создать Копию
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-950 text-xs uppercase font-bold text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Дата</th>
                            <th className="px-6 py-4">День</th>
                            <th className="px-6 py-4">Тип</th>
                            <th className="px-6 py-4">Размер</th>
                            <th className="px-6 py-4 text-right">Действие</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {BACKUPS.map(b => (
                            <tr key={b.id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 text-white font-mono">{b.date}</td>
                                <td className="px-6 py-4">{b.day}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${b.type === 'Auto' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                        {b.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono">{b.size}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={handleRestore} className="text-xs font-bold text-green-400 hover:underline flex items-center gap-1 justify-end">
                                        <RotateCcw className="w-3 h-3" /> Восстановить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SysAdminMaintenance = ({ language }: { language: Language }) => {
    const tasks = [
        { id: 1, name: 'Очистка Redis Кэша', desc: 'Удаляет все временные сессии', icon: Trash },
        { id: 2, name: 'Пересборка Ассетов', desc: 'Обновляет CDN ссылки', icon: RefreshCw },
        { id: 3, name: 'Vacuum Базы Данных', desc: 'Оптимизирует место на диске', icon: Database },
        { id: 4, name: 'Ротация Логов', desc: 'Архивирует старые логи', icon: Archive },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
            {tasks.map(task => (
                <div key={task.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex justify-between items-center hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-800 p-3 rounded-xl">
                            <task.icon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{task.name}</h4>
                            <p className="text-xs text-gray-500">{task.desc}</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all">
                        ЗАПУСТИТЬ
                    </button>
                </div>
            ))}
        </div>
    );
};

const SysAdminThemes = ({ language, themeColor, setThemeColor, fontScale, setFontScale }: any) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Palette className="text-pink-500" /> {language === 'ru' ? 'Настройки Темы' : 'Theme Settings'}
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2 font-bold">Основной Цвет (Accent)</label>
                        <div className="flex gap-3">
                            {['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setThemeColor(c)}
                                    className={`w-10 h-10 rounded-full border-2 ${themeColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2 font-bold">Размер Шрифта: {fontScale}%</label>
                        <input 
                            type="range" 
                            min="80" max="120" 
                            value={fontScale} 
                            onChange={(e) => setFontScale(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SysAdminFeatures = ({ isMaintenance, setMaintenance, isLaunchMode, setLaunchMode, language, gamesStatus, setGamesStatus, isEventEnabled, setEventEnabled }: any) => {
    const toggleGame = (id: GameId) => {
        setGamesStatus((prev: GamesConfig) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="text-blue-500" /> {language === 'ru' ? 'Управление Функциями' : 'Feature Flags'}
            </h2>
            
            {/* Global Modes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`bg-gray-900 border ${isMaintenance ? 'border-red-500' : 'border-gray-800'} p-4 rounded-xl flex justify-between items-center shadow-lg transition-all duration-300`}>
                    <div>
                        <span className="text-white font-bold flex items-center gap-2">
                            <AlertOctagon className={isMaintenance ? "text-red-500" : "text-gray-500"} /> 
                            {language === 'ru' ? 'Технический Режим' : 'Maintenance Mode'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                            {language === 'ru' ? 'Блокирует доступ' : 'Blocks access'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setMaintenance(!isMaintenance)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isMaintenance ? 'bg-red-500' : 'bg-gray-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isMaintenance ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div className={`bg-gray-900 border ${isLaunchMode ? 'border-purple-500' : 'border-gray-800'} p-4 rounded-xl flex justify-between items-center shadow-lg transition-all duration-300`}>
                    <div>
                        <span className="text-white font-bold flex items-center gap-2">
                            <Rocket className={isLaunchMode ? "text-purple-500" : "text-gray-500"} /> 
                            {language === 'ru' ? 'Режим "Скоро Запуск"' : 'Launch Mode'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                            {language === 'ru' ? 'Таймер отсчета' : 'Countdown timer'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setLaunchMode(!isLaunchMode)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isLaunchMode ? 'bg-purple-500' : 'bg-gray-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isLaunchMode ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div className={`bg-gray-900 border ${isEventEnabled ? 'border-blue-500' : 'border-gray-800'} p-4 rounded-xl flex justify-between items-center shadow-lg transition-all duration-300`}>
                    <div>
                        <span className="text-white font-bold flex items-center gap-2">
                            <Snowflake className={isEventEnabled ? "text-blue-500" : "text-gray-500"} /> 
                            {language === 'ru' ? 'Сезонное Событие' : 'Seasonal Event'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                            {language === 'ru' ? 'Доступ к елке' : 'Tree access'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setEventEnabled(!isEventEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isEventEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isEventEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* GAME AVAILABILITY */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
                    <Gamepad2 className="text-pink-500 w-5 h-5" /> {language === 'ru' ? 'Доступность Игр' : 'Game Availability'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(gamesStatus).map((key) => {
                        const id = key as GameId;
                        const enabled = gamesStatus[id];
                        return (
                            <div key={id} className={`bg-black/40 border ${enabled ? 'border-green-500/30' : 'border-red-500/30'} p-4 rounded-xl flex justify-between items-center transition-colors`}>
                                <span className={`font-mono font-bold text-sm uppercase ${enabled ? 'text-white' : 'text-gray-500'}`}>{id}</span>
                                <button 
                                    onClick={() => toggleGame(id)}
                                    className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-green-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${enabled ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SysAdminContent = ({ language, menuItems, setMenuItems, promoCodes, setPromoCodes, heroPromos, setHeroPromos, shopItems, setShopItems }: any) => {
    const [activeTab, setActiveTab] = useState<'menu' | 'promos' | 'banners' | 'market'>('menu');
    const [editId, setEditId] = useState<string | number | null>(null);
    const [editData, setEditData] = useState<any>({});

    // Menu Logic
    const handleAddMenu = () => {
        const newItem = { id: Date.now().toString(), name: 'New Pizza', price: 0, description: 'Description', image: '' };
        setMenuItems([...menuItems, newItem]);
        setEditId(newItem.id);
        setEditData(newItem);
    };
    const handleSaveMenu = () => {
        setMenuItems(menuItems.map((i: any) => i.id === editId ? editData : i));
        setEditId(null);
    };
    const handleDeleteMenu = (id: string) => {
        if(confirm('Delete item?')) setMenuItems(menuItems.filter((i: any) => i.id !== id));
    };

    // Promo Logic
    const handleAddPromo = () => {
        const newPromo = { id: Date.now(), code: 'NEW_CODE', discount: '0%', active: false };
        setPromoCodes([...promoCodes, newPromo]);
        setEditId(newPromo.id);
        setEditData(newPromo);
    };
    const handleSavePromo = () => {
        setPromoCodes(promoCodes.map((p: any) => p.id === editId ? editData : p));
        setEditId(null);
    };
    const handleDeletePromo = (id: number) => {
        if(confirm('Delete promo?')) setPromoCodes(promoCodes.filter((p: any) => p.id !== id));
    };

    // Shop Item Logic
    const handleAddShopItem = () => {
        const newItem: ShopItem = {
            id: Date.now(),
            name: { ru: 'Новый Товар', en: 'New Item' },
            description: { ru: 'Описание', en: 'Description' },
            cost: 100,
            rarity: 'common',
            category: 'food',
            iconType: 'food'
        };
        setShopItems([...shopItems, newItem]);
        setEditId(newItem.id);
        setEditData(newItem);
    };
    const handleSaveShopItem = () => {
        setShopItems(shopItems.map((i: ShopItem) => i.id === editId ? editData : i));
        setEditId(null);
    };
    const handleDeleteShopItem = (id: number) => {
        if(confirm('Delete item?')) setShopItems(shopItems.filter((i: ShopItem) => i.id !== id));
    };

    // Banners Logic
    const handleSaveBanner = (id: number, field: string, value: string) => {
        setHeroPromos(heroPromos.map((p: PromoItem) => {
            if (p.id === id) {
                // Deep update for localized fields
                if (field === 'title_ru') return { ...p, title: { ...p.title, ru: value } };
                if (field === 'title_en') return { ...p, title: { ...p.title, en: value } };
                if (field === 'desc_ru') return { ...p, desc: { ...p.desc, ru: value } };
                if (field === 'desc_en') return { ...p, desc: { ...p.desc, en: value } };
            }
            return p;
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800 w-fit flex-wrap">
                <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${activeTab === 'menu' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Меню</button>
                <button onClick={() => setActiveTab('promos')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${activeTab === 'promos' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>Промокоды</button>
                <button onClick={() => setActiveTab('banners')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${activeTab === 'banners' ? 'bg-orange-600 text-white' : 'text-gray-400'}`}>Баннеры</button>
                <button onClick={() => setActiveTab('market')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${activeTab === 'market' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}>Магазин</button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-x-auto">
                
                {/* MENU TAB */}
                {activeTab === 'menu' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-white">Список Пицц</h3>
                            <button onClick={handleAddMenu} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Добавить</button>
                        </div>
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-950 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="p-3">Картинка</th>
                                    <th className="p-3">Название</th>
                                    <th className="p-3">Цена</th>
                                    <th className="p-3">Описание</th>
                                    <th className="p-3 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {menuItems.map((item: any) => (
                                    <tr key={item.id}>
                                        {editId === item.id ? (
                                            <>
                                                <td className="p-3"><input value={editData.image} onChange={e => setEditData({...editData, image: e.target.value})} className="bg-black border border-gray-600 rounded p-1 text-white w-full" placeholder="URL" /></td>
                                                <td className="p-3"><input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="bg-black border border-gray-600 rounded p-1 text-white w-full" /></td>
                                                <td className="p-3"><input value={editData.price} onChange={e => setEditData({...editData, price: Number(e.target.value)})} className="bg-black border border-gray-600 rounded p-1 text-white w-20" type="number" /></td>
                                                <td className="p-3"><input value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} className="bg-black border border-gray-600 rounded p-1 text-white w-full" /></td>
                                                <td className="p-3 text-right flex justify-end gap-2">
                                                    <button onClick={handleSaveMenu} className="text-green-400"><Save className="w-4 h-4" /></button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-3">
                                                    {item.image ? <img src={item.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-800" /> : <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center"><ImageIcon className="w-4 h-4" /></div>}
                                                </td>
                                                <td className="p-3 font-bold text-white">{item.name}</td>
                                                <td className="p-3 text-yellow-400">{item.price} ₽</td>
                                                <td className="p-3 text-xs truncate max-w-[200px]">{item.description}</td>
                                                <td className="p-3 text-right flex justify-end gap-2">
                                                    <button onClick={() => {setEditId(item.id); setEditData(item);}} className="text-blue-400"><Edit3 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteMenu(item.id)} className="text-red-400"><Trash className="w-4 h-4" /></button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* PROMOS TAB */}
                {activeTab === 'promos' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-white">Активные Промокоды</h3>
                            <button onClick={handleAddPromo} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Добавить</button>
                        </div>
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-950 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="p-3">Код</th>
                                    <th className="p-3">Скидка</th>
                                    <th className="p-3">Статус</th>
                                    <th className="p-3 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {promoCodes.map((promo: any) => (
                                    <tr key={promo.id}>
                                        {editId === promo.id ? (
                                            <>
                                                <td className="p-3"><input value={editData.code} onChange={e => setEditData({...editData, code: e.target.value})} className="bg-black border border-gray-600 rounded p-1 text-white uppercase" /></td>
                                                <td className="p-3"><input value={editData.discount} onChange={e => setEditData({...editData, discount: e.target.value})} className="bg-black border border-gray-600 rounded p-1 text-white w-20" /></td>
                                                <td className="p-3">
                                                    <button onClick={() => setEditData({...editData, active: !editData.active})} className={`px-2 py-1 rounded text-xs ${editData.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                        {editData.active ? 'ON' : 'OFF'}
                                                    </button>
                                                </td>
                                                <td className="p-3 text-right flex justify-end gap-2">
                                                    <button onClick={handleSavePromo} className="text-green-400"><Save className="w-4 h-4" /></button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-3 font-mono font-bold text-white">{promo.code}</td>
                                                <td className="p-3 text-yellow-400">{promo.discount}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${promo.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {promo.active ? 'ACTIVE' : 'DISABLED'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right flex justify-end gap-2">
                                                    <button onClick={() => {setEditId(promo.id); setEditData(promo);}} className="text-blue-400"><Edit3 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeletePromo(promo.id)} className="text-red-400"><Trash className="w-4 h-4" /></button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* MARKET TAB */}
                {activeTab === 'market' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-white">Товары Кибер Маркета</h3>
                            <button onClick={handleAddShopItem} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Добавить</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400 min-w-[800px]">
                                <thead className="bg-gray-950 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="p-3">Иконка</th>
                                        <th className="p-3">Название (RU)</th>
                                        <th className="p-3">Название (EN)</th>
                                        <th className="p-3">Цена</th>
                                        <th className="p-3">Тип</th>
                                        <th className="p-3">Редкость</th>
                                        <th className="p-3 text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {shopItems.map((item: ShopItem) => (
                                        <tr key={item.id}>
                                            {editId === item.id ? (
                                                <>
                                                    <td className="p-3">
                                                        <select 
                                                            value={editData.iconType} 
                                                            onChange={e => setEditData({...editData, iconType: e.target.value})} 
                                                            className="bg-black border border-gray-600 rounded p-1 text-white w-24 text-xs"
                                                        >
                                                            <option value="food">Food</option>
                                                            <option value="drink">Drink</option>
                                                            <option value="ticket">Ticket</option>
                                                            <option value="box">Box</option>
                                                            <option value="star">Star</option>
                                                            <option value="cheese">Cheese</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3"><input value={editData.name?.ru} onChange={e => setEditData({...editData, name: { ...editData.name, ru: e.target.value }})} className="bg-black border border-gray-600 rounded p-1 text-white w-full" /></td>
                                                    <td className="p-3"><input value={editData.name?.en} onChange={e => setEditData({...editData, name: { ...editData.name, en: e.target.value }})} className="bg-black border border-gray-600 rounded p-1 text-white w-full" /></td>
                                                    <td className="p-3"><input value={editData.cost} onChange={e => setEditData({...editData, cost: Number(e.target.value)})} className="bg-black border border-gray-600 rounded p-1 text-white w-20" type="number" /></td>
                                                    <td className="p-3">
                                                        <select value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})} className="bg-black border border-gray-600 rounded p-1 text-white w-24 text-xs">
                                                            <option value="food">Food</option>
                                                            <option value="discount">Discount</option>
                                                            <option value="special">Special</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3">
                                                        <select value={editData.rarity} onChange={e => setEditData({...editData, rarity: e.target.value})} className="bg-black border border-gray-600 rounded p-1 text-white w-24 text-xs">
                                                            <option value="common">Common</option>
                                                            <option value="rare">Rare</option>
                                                            <option value="epic">Epic</option>
                                                            <option value="legendary">Legendary</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3 text-right flex justify-end gap-2">
                                                        <button onClick={handleSaveShopItem} className="text-green-400"><Save className="w-4 h-4" /></button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="p-3 text-xs font-mono">{item.iconType}</td>
                                                    <td className="p-3 font-bold text-white">{item.name.ru}</td>
                                                    <td className="p-3 text-gray-500">{item.name.en}</td>
                                                    <td className="p-3 text-yellow-400 font-mono">{item.cost}</td>
                                                    <td className="p-3 text-xs uppercase">{item.category}</td>
                                                    <td className="p-3"><span className={`text-[10px] px-2 py-1 rounded uppercase font-bold ${item.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-700 text-gray-400'}`}>{item.rarity}</span></td>
                                                    <td className="p-3 text-right flex justify-end gap-2">
                                                        <button onClick={() => {setEditId(item.id); setEditData(item);}} className="text-blue-400"><Edit3 className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDeleteShopItem(item.id)} className="text-red-400"><Trash className="w-4 h-4" /></button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* BANNERS TAB */}
                {activeTab === 'banners' && (
                    <div className="space-y-6">
                        {heroPromos.map((promo: PromoItem) => (
                            <div key={promo.id} className="bg-black/40 p-4 rounded-xl border border-gray-700">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-gray-400" /> Баннер #{promo.id}
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Заголовок (RU)</label>
                                        <input 
                                            value={promo.title.ru} 
                                            onChange={(e) => handleSaveBanner(promo.id, 'title_ru', e.target.value)}
                                            className="w-full bg-black border border-gray-600 rounded p-2 text-white text-sm" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Описание (RU)</label>
                                        <input 
                                            value={promo.desc.ru} 
                                            onChange={(e) => handleSaveBanner(promo.id, 'desc_ru', e.target.value)}
                                            className="w-full bg-black border border-gray-600 rounded p-2 text-white text-sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, heroPromos, setHeroPromos, isMaintenance, setMaintenance, isLaunchMode, setLaunchMode, gamesStatus, setGamesStatus, isEventEnabled, setEventEnabled, shopItems, setShopItems }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [currentRole, setCurrentRole] = useState<Role>('marketing');
  const [marketingView, setMarketingView] = useState<MarketingView>('overview');
  const [sysAdminView, setSysAdminView] = useState<SysAdminView>('health');
  
  const [themeColor, setThemeColor] = useState('#ec4899');
  const [fontScale, setFontScale] = useState(100);

  const [menuItems, setMenuItems] = useState([
      { id: '1', name: 'Новогодняя (Tangerine)', price: 755, description: 'Праздничная пицца с мандаринами и сыром дорблю.', image: '' },
      { id: '2', name: 'Рождественская (Pomegranate)', price: 755, description: 'Изысканная пицца с гранатом и розмарином.', image: '' },
      { id: '3', name: 'Пепперони Классик', price: 650, description: 'Любимая классика с колбасками пепперони.', image: '' },
      { id: '4', name: 'Сырная', price: 590, description: 'Четыре вида сыра на сливочной основе.', image: '' },
  ]);
  
  const [promoCodes, setPromoCodes] = useState([
      { id: 1, code: 'NEWYEAR2025', discount: '20%', active: true },
      { id: 2, code: 'GAMER', discount: '10%', active: true },
      { id: 3, code: 'SECRET_VIP', discount: '500 PTS', active: false },
  ]);

  const t = {
    roles: {
        marketing: language === 'ru' ? 'Маркетолог' : 'Marketer',
        sysadmin: language === 'ru' ? 'Сис. Админ' : 'Sys Admin',
    },
    views: {
        overview: language === 'ru' ? 'Дашборд 360' : 'Dashboard 360',
        campaigns: language === 'ru' ? 'Кампании & Ads' : 'Campaigns & Ads',
        segments: language === 'ru' ? 'Аудитория & Сегменты' : 'Audience & Segments',
        funnels: language === 'ru' ? 'Воронки & UX' : 'Funnels & UX',
        rewards: language === 'ru' ? 'Награды и Бонусы' : 'Rewards & Bonuses',
        health: language === 'ru' ? 'Центр Управления' : 'Mission Control',
        themes: language === 'ru' ? 'Темы и Оформление' : 'Themes & UI',
        logs: language === 'ru' ? 'Логи Сервера' : 'Server Logs',
        features: language === 'ru' ? 'Управление Функциями' : 'Feature Flags',
        backup: language === 'ru' ? 'Бэкап и Восстановление' : 'Backup & Restore',
        content: language === 'ru' ? 'Управление Контентом' : 'Content Manager',
        maintenance: language === 'ru' ? 'Обслуживание' : 'Maintenance',
    },
    headers: {
        growth: language === 'ru' ? 'Рост' : 'Growth',
        audience: language === 'ru' ? 'Аудитория' : 'Audience',
        devops: language === 'ru' ? 'DevOps' : 'DevOps',
        config: language === 'ru' ? 'Конфигурация' : 'Configuration',
        data: language === 'ru' ? 'Данные' : 'Data',
    },
    marketing: {
        title: language === 'ru' ? 'Growth & Retention Suite' : 'Growth & Retention Suite',
        status: language === 'ru' ? 'Живые данные' : 'Live Data',
    },
    admin: {
        title: language === 'ru' ? 'Статус и Настройки' : 'System Status & Configuration',
        status: language === 'ru' ? 'Системы в норме' : 'Systems Operational',
    },
    login: {
        title: language === 'ru' ? 'ВХОД В СИСТЕМУ' : 'SYSTEM ACCESS',
        subtitle: language === 'ru' ? 'ВВЕДИТЕ УЧЕТНЫЕ ДАННЫЕ АДМИНИСТРАТОРА' : 'ENTER ADMIN CREDENTIALS',
        user: language === 'ru' ? 'ИМЯ ПОЛЬЗОВАТЕЛЯ' : 'CODENAME',
        pass: language === 'ru' ? 'ПАРОЛЬ' : 'PASSKEY',
        btn: language === 'ru' ? 'ВОЙТИ В MAINFRAME' : 'ACCESS MAINFRAME',
        error: language === 'ru' ? 'ДОСТУП ЗАПРЕЩЕН: НЕВЕРНЫЙ КЛЮЧ' : 'ACCESS DENIED: INVALID CREDENTIALS'
    }
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (loginUser === 'ForkiStyle' && loginPass === '1313131998') {
          setIsAuthenticated(true);
          setLoginError('');
      } else {
          setLoginError(t.login.error);
      }
  };

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none"></div>
              
              <div className="relative z-10 w-full max-w-md bg-gray-900/80 border border-blue-500/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.2)] backdrop-blur-xl animate-in zoom-in duration-500">
                  <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-pulse">
                          <ShieldCheck className="w-10 h-10 text-blue-400" />
                      </div>
                      <h2 className="text-3xl font-black italic text-white tracking-wider mb-2">{t.login.title}</h2>
                      <p className="text-[10px] font-mono text-blue-400 tracking-[0.2em] uppercase">{t.login.subtitle}</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                              <User className="w-3 h-3" /> {t.login.user}
                          </label>
                          <input 
                              type="text" 
                              value={loginUser}
                              onChange={e => setLoginUser(e.target.value)}
                              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-mono focus:border-blue-500 outline-none transition-all focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                              placeholder="username"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                              <KeyRound className="w-3 h-3" /> {t.login.pass}
                          </label>
                          <input 
                              type="password" 
                              value={loginPass}
                              onChange={e => setLoginPass(e.target.value)}
                              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-mono focus:border-blue-500 outline-none transition-all focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                              placeholder="••••••••••"
                          />
                      </div>

                      {loginError && (
                          <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded-lg flex items-center gap-2 animate-bounce">
                              <AlertCircle className="w-4 h-4" /> {loginError}
                          </div>
                      )}

                      <button 
                          type="submit"
                          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                      >
                          {t.login.btn} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                  </form>
                  
                  <div className="mt-6 text-center">
                      <span className="text-[9px] text-gray-600 font-mono">SECURE CONNECTION ESTABLISHED • v3.3</span>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-72 bg-gray-950 border-r border-gray-800 p-4 flex flex-col gap-2">
          {/* Role Switcher */}
          <div className="mb-6 p-1 bg-gray-900 rounded-xl border border-gray-800 flex">
             <button 
                onClick={() => setCurrentRole('marketing')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${currentRole === 'marketing' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:text-white'}`}
             >
                {t.roles.marketing}
             </button>
             <button 
                onClick={() => setCurrentRole('sysadmin')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${currentRole === 'sysadmin' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-white'}`}
             >
                {t.roles.sysadmin}
             </button>
          </div>

          {/* Navigation based on Role */}
          {currentRole === 'marketing' ? (
             <>
                <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest">{t.headers.growth}</div>
                <SidebarItem active={marketingView === 'overview'} onClick={() => setMarketingView('overview')} icon={PieIcon} label={t.views.overview} />
                <SidebarItem active={marketingView === 'campaigns'} onClick={() => setMarketingView('campaigns')} icon={Megaphone} label={t.views.campaigns} />
                <SidebarItem active={marketingView === 'funnels'} onClick={() => setMarketingView('funnels')} icon={Filter} label={t.views.funnels} />
                
                <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest mt-4">{t.headers.audience}</div>
                <SidebarItem active={marketingView === 'segments'} onClick={() => setMarketingView('segments')} icon={Layers} label={t.views.segments} />
                <SidebarItem active={marketingView === 'rewards'} onClick={() => setMarketingView('rewards')} icon={Gift} label={t.views.rewards} />
             </>
          ) : (
             <>
                <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest">{t.headers.devops}</div>
                <SidebarItem active={sysAdminView === 'health'} onClick={() => setSysAdminView('health')} icon={Activity} label={t.views.health} />
                <SidebarItem active={sysAdminView === 'logs'} onClick={() => setSysAdminView('logs')} icon={Terminal} label={t.views.logs} />
                <SidebarItem active={sysAdminView === 'backup'} onClick={() => setSysAdminView('backup')} icon={Database} label={t.views.backup} />
                <SidebarItem active={sysAdminView === 'maintenance'} onClick={() => setSysAdminView('maintenance')} icon={Wrench} label={t.views.maintenance} />
                
                <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest mt-4">{t.headers.config}</div>
                <SidebarItem active={sysAdminView === 'themes'} onClick={() => setSysAdminView('themes')} icon={Palette} label={t.views.themes} />
                <SidebarItem active={sysAdminView === 'features'} onClick={() => setSysAdminView('features')} icon={Settings} label={t.views.features} />

                <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest mt-4">{t.headers.data}</div>
                <SidebarItem active={sysAdminView === 'content'} onClick={() => setSysAdminView('content')} icon={FileText} label={t.views.content} />
             </>
          )}

          <div className="mt-auto pt-4 border-t border-gray-800 text-center text-xs text-gray-600">
             Admin Console v4.0
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto relative bg-[#0a0a0a]">
         {/* Top Bar */}
         <div className="flex justify-between items-center mb-8">
             <div>
                 <h1 className="text-3xl font-bold text-white">
                    {currentRole === 'marketing' ? t.views[marketingView] : t.views[sysAdminView]}
                 </h1>
                 <p className="text-gray-500 text-sm mt-1">
                    {currentRole === 'marketing' ? t.marketing.title : t.admin.title}
                 </p>
             </div>
             <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full text-sm font-mono text-green-400 border border-green-900/50">
                     <div className="w-2 h-2 rounded-full bg-green-50 animate-pulse"></div> 
                     {currentRole === 'marketing' ? t.marketing.status : t.admin.status}
                 </div>
             </div>
         </div>

         {/* Render Views based on Role & Selection */}
         {currentRole === 'marketing' && (
            <>
               {marketingView === 'overview' && <MarketingOverview language={language} />}
               {marketingView === 'campaigns' && <MarketingCampaigns />}
               {marketingView === 'funnels' && <MarketingFunnels language={language} />}
               {marketingView === 'segments' && <MarketingSegments language={language} />}
               {marketingView === 'rewards' && <MarketingRewards language={language} />}
            </>
         )}

         {currentRole === 'sysadmin' && (
            <>
               {sysAdminView === 'health' && (
                   <SysAdminMissionControl 
                      language={language} 
                      isMaintenance={isMaintenance}
                      setMaintenance={setMaintenance}
                   />
               )}
               {sysAdminView === 'themes' && (
                   <SysAdminThemes 
                      language={language} 
                      themeColor={themeColor} 
                      setThemeColor={setThemeColor} 
                      fontScale={fontScale} 
                      setFontScale={setFontScale} 
                   />
               )}
               {sysAdminView === 'logs' && <SysAdminLogs />}
               {sysAdminView === 'features' && (
                   <SysAdminFeatures 
                        isMaintenance={isMaintenance} 
                        setMaintenance={setMaintenance} 
                        isLaunchMode={isLaunchMode} 
                        setLaunchMode={setLaunchMode} 
                        language={language}
                        gamesStatus={gamesStatus}
                        setGamesStatus={setGamesStatus}
                        isEventEnabled={isEventEnabled}
                        setEventEnabled={setEventEnabled}
                   />
               )}
               {sysAdminView === 'backup' && <SysAdminBackup language={language} />}
               {sysAdminView === 'maintenance' && <SysAdminMaintenance language={language} />}
               {sysAdminView === 'content' && (
                   <SysAdminContent 
                      language={language} 
                      menuItems={menuItems} 
                      setMenuItems={setMenuItems} 
                      promoCodes={promoCodes} 
                      setPromoCodes={setPromoCodes}
                      heroPromos={heroPromos}
                      setHeroPromos={setHeroPromos}
                      shopItems={shopItems}
                      setShopItems={setShopItems}
                   />
               )}
            </>
         )}

      </div>
    </div>
  );
};

export default AdminDashboard;
