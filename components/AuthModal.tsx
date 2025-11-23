
import React, { useState, useEffect } from 'react';
import { X, Smartphone, KeyRound, User, CheckCircle2, Cpu, ShieldCheck, Loader2, Zap } from 'lucide-react';
import { Language, User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  language: Language;
}

type Step = 'phone' | 'sms' | 'profile' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, language }) => {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulated "Matrix" effect for nickname generation
  const [genName, setGenName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setCode('');
      setNickname('');
    }
  }, [isOpen]);

  const t = {
    title: language === 'ru' ? 'ИДЕНТИФИКАЦИЯ' : 'IDENTITY LINK',
    subtitle: language === 'ru' ? 'Доступ к клубу CyberPizza' : 'Access to CyberPizza Club',
    phoneLabel: language === 'ru' ? 'МОБИЛЬНЫЙ ТЕРМИНАЛ' : 'MOBILE TERMINAL',
    smsLabel: language === 'ru' ? 'КОД ДОСТУПА' : 'ACCESS CODE',
    nickLabel: language === 'ru' ? 'КОДОВОЕ ИМЯ' : 'CODENAME',
    sendCode: language === 'ru' ? 'ОТПРАВИТЬ КОД' : 'SEND CODE',
    verify: language === 'ru' ? 'ПОДТВЕРДИТЬ' : 'VERIFY',
    create: language === 'ru' ? 'СОЗДАТЬ ID' : 'MINT ID',
    processing: language === 'ru' ? 'ОБРАБОТКА...' : 'PROCESSING...',
    success: language === 'ru' ? 'ДОСТУП РАЗРЕШЕН' : 'ACCESS GRANTED',
    enterPhone: language === 'ru' ? 'Введите номер' : 'Enter phone number',
    enterSms: language === 'ru' ? 'Введите код из SMS' : 'Enter SMS code',
    genNick: language === 'ru' ? 'Генерировать' : 'Generate',
  };

  const handlePhoneSubmit = () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('sms');
    }, 1000);
  };

  const handleSmsSubmit = () => {
    if (code.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate checking if user exists. For demo, we go to profile creation.
      setStep('profile'); 
    }, 1000);
  };

  const generateNickname = () => {
    const prefixes = ['Cyber', 'Neon', 'Pizza', 'Tech', 'Void', 'Glitch', 'Hyper'];
    const suffixes = ['Rider', 'Ninja', 'Chef', 'King', 'Samurai', 'Runner', 'Bot'];
    const randName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}_${Math.floor(Math.random() * 999)}`;
    setNickname(randName);
  };

  const handleProfileSubmit = () => {
    if (!nickname) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      
      // Finalize after animation
      setTimeout(() => {
        const newUser: UserType = {
            id: `u_${Date.now()}`,
            name: nickname,
            points: 500, // Welcome bonus
            rank: 'Novice'
        };
        onLogin(newUser);
      }, 1500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 border border-pink-500/30 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.2)] overflow-hidden flex flex-col animate-in zoom-in duration-300">
        
        {/* Header HUD */}
        <div className="bg-gray-800/50 border-b border-gray-700 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-pink-500" />
                <div>
                    <h3 className="font-black text-white italic tracking-wider">{t.title}</h3>
                    <p className="text-[10px] text-gray-400 font-mono uppercase">{t.subtitle}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-8">
            
            {/* STEP 1: PHONE */}
            {step === 'phone' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <Smartphone className="w-10 h-10 text-blue-400" />
                        </div>
                        <p className="text-gray-400 text-sm">{t.enterPhone}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">{t.phoneLabel}</label>
                        <input 
                           type="tel" 
                           value={phone}
                           onChange={(e) => setPhone(e.target.value)}
                           placeholder="+7 (999) 000-00-00"
                           className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white font-mono text-lg focus:border-blue-500 outline-none transition-colors"
                           autoFocus
                        />
                    </div>
                    <button 
                       onClick={handlePhoneSubmit}
                       disabled={isLoading || phone.length < 5}
                       className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl uppercase tracking-wider shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : t.sendCode}
                    </button>
                </div>
            )}

            {/* STEP 2: SMS */}
            {step === 'sms' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                            <KeyRound className="w-10 h-10 text-purple-400" />
                        </div>
                        <p className="text-gray-400 text-sm">{t.enterSms}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 block">{t.smsLabel}</label>
                        <input 
                           type="text" 
                           value={code}
                           onChange={(e) => setCode(e.target.value)}
                           placeholder="0000"
                           maxLength={4}
                           className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white font-mono text-center text-2xl tracking-[0.5em] focus:border-purple-500 outline-none transition-colors"
                           autoFocus
                        />
                    </div>
                    <button 
                       onClick={handleSmsSubmit}
                       disabled={isLoading || code.length < 4}
                       className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl uppercase tracking-wider shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : t.verify}
                    </button>
                </div>
            )}

            {/* STEP 3: PROFILE */}
            {step === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30 relative">
                            <User className="w-10 h-10 text-pink-400" />
                            <Cpu className="absolute -bottom-2 -right-2 w-8 h-8 text-cyan-400 animate-spin-slow" />
                        </div>
                        <p className="text-gray-400 text-sm">Initializing Cyber-Identity...</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-pink-400 uppercase tracking-widest">{t.nickLabel}</label>
                            <button onClick={generateNickname} className="text-[10px] text-cyan-400 hover:text-white uppercase font-bold flex items-center gap-1">
                                <Zap className="w-3 h-3" /> {t.genNick}
                            </button>
                        </div>
                        <input 
                           type="text" 
                           value={nickname}
                           onChange={(e) => setNickname(e.target.value)}
                           placeholder="CyberPlayer_1"
                           className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white font-mono text-lg focus:border-pink-500 outline-none transition-colors"
                        />
                    </div>
                    <button 
                       onClick={handleProfileSubmit}
                       disabled={isLoading || !nickname}
                       className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl uppercase tracking-wider shadow-lg shadow-pink-900/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : t.create}
                    </button>
                </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'success' && (
                <div className="text-center py-12 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500">
                        <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-black text-white italic mb-2">{t.success}</h2>
                    <p className="text-gray-400 font-mono mb-8">Welcome, {nickname}</p>
                    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 animate-[width_1.5s_ease-out_forwards]" style={{width: '100%'}}></div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
