
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { BrainCircuit, Check, X, Clock, Zap, Award, ArrowRight } from 'lucide-react';

interface QuizGameProps {
  language: Language;
  onComplete: (score: number) => void;
}

const QUESTIONS = [
  {
    id: 1,
    q: { ru: "Откуда родом пицца 'Маргарита'?", en: "Where does pizza 'Margherita' come from?" },
    options: { ru: ["Рим", "Неаполь", "Милан", "Флоренция"], en: ["Rome", "Naples", "Milan", "Florence"] },
    correct: 1
  },
  {
    id: 2,
    q: { ru: "Какая температура идеальна для выпечки пиццы?", en: "Ideal temperature for baking pizza?" },
    options: { ru: ["180°C", "250°C", "400°C+", "100°C"], en: ["180°C", "250°C", "400°C+", "100°C"] },
    correct: 2
  },
  {
    id: 3,
    q: { ru: "Что такое 'корнишон' в пицце?", en: "What is a 'cornicione'?" },
    options: { ru: ["Сыр", "Соус", "Бортик теста", "Оливка"], en: ["Cheese", "Sauce", "The Crust Rim", "Olive"] },
    correct: 2
  },
  {
    id: 4,
    q: { ru: "Самая популярная пицца в мире?", en: "Most popular pizza in the world?" },
    options: { ru: ["Пепперони", "Гавайская", "4 Сыра", "Маринара"], en: ["Pepperoni", "Hawaiian", "4 Cheese", "Marinara"] },
    correct: 0
  },
  {
    id: 5,
    q: { ru: "Какой ингредиент делает тесто пышным?", en: "What makes dough rise?" },
    options: { ru: ["Соль", "Дрожжи", "Сахар", "Масло"], en: ["Salt", "Yeast", "Sugar", "Oil"] },
    correct: 1
  }
];

const QuizGame: React.FC<QuizGameProps> = ({ language, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'intro' | 'playing' | 'result'>('intro');
  const [streak, setStreak] = useState(0);

  const t = {
    title: language === 'ru' ? 'КИБЕР ВИКТОРИНА' : 'CYBER TRIVIA',
    subtitle: language === 'ru' ? 'Проверь знания и получи бонусы' : 'Test knowledge and earn bonuses',
    start: language === 'ru' ? 'НАЧАТЬ' : 'START QUIZ',
    question: language === 'ru' ? 'ВОПРОС' : 'QUESTION',
    next: language === 'ru' ? 'СЛЕДУЮЩИЙ' : 'NEXT',
    finish: language === 'ru' ? 'ЗАВЕРШИТЬ' : 'FINISH',
    score: language === 'ru' ? 'Твой счет:' : 'Your Score:',
    claim: language === 'ru' ? 'ЗАБРАТЬ ОЧКИ' : 'CLAIM POINTS',
    timeOut: language === 'ru' ? 'ВРЕМЯ ВЫШЛО!' : 'TIME UP!'
  };

  useEffect(() => {
    if (status === 'playing' && timeLeft > 0 && selected === null) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selected === null) {
       handleAnswer(-1); // Time out wrong answer
    }
  }, [timeLeft, status, selected]);

  const startGame = () => {
    setStatus('playing');
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setSelected(null);
  };

  const handleAnswer = (index: number) => {
    setSelected(index);
    const correct = QUESTIONS[currentQ].correct;
    if (index === correct) {
      const timeBonus = Math.ceil(timeLeft / 2);
      const streakBonus = streak * 5;
      setScore(prev => prev + 100 + timeBonus + streakBonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTimeLeft(15);
      setSelected(null);
    } else {
      setStatus('result');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="relative bg-gray-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] min-h-[500px] flex flex-col">
        
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* INTRO SCREEN */}
        {status === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
             <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center mb-6 border border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <BrainCircuit className="w-12 h-12 text-purple-400" />
             </div>
             <h2 className="text-5xl font-black italic text-white mb-2 tracking-tighter">{t.title}</h2>
             <p className="text-purple-300 font-mono mb-8">{t.subtitle}</p>
             <button 
               onClick={startGame}
               className="px-10 py-4 bg-white text-purple-900 font-black text-xl rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
             >
               {t.start}
             </button>
          </div>
        )}

        {/* GAME SCREEN */}
        {status === 'playing' && (
          <div className="flex-1 p-8 z-10 flex flex-col">
             {/* HUD */}
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                   <div className="text-xs font-bold text-gray-400 uppercase">{t.question} {currentQ + 1}/{QUESTIONS.length}</div>
                   <div className="px-3 py-1 bg-gray-800 rounded-full border border-purple-500/30 flex items-center gap-2 text-purple-400 font-mono font-bold">
                      <Zap className="w-3 h-3" /> {score}
                   </div>
                </div>
                <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                   <Clock className="w-5 h-5" /> {timeLeft}s
                </div>
             </div>

             {/* QUESTION */}
             <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center leading-relaxed">
                  {QUESTIONS[currentQ].q[language]}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {QUESTIONS[currentQ].options[language].map((opt, idx) => {
                      let btnClass = "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200"; // Default
                      
                      if (selected !== null) {
                         if (idx === QUESTIONS[currentQ].correct) btnClass = "bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"; // Correct
                         else if (idx === selected) btnClass = "bg-red-600 border-red-500 text-white"; // Wrong selected
                         else btnClass = "bg-gray-800 border-gray-700 opacity-50"; // Others
                      }

                      return (
                        <button
                          key={idx}
                          disabled={selected !== null}
                          onClick={() => handleAnswer(idx)}
                          className={`p-6 rounded-2xl border-2 text-lg font-bold transition-all transform ${btnClass} ${selected === null ? 'hover:-translate-y-1 hover:shadow-lg' : ''}`}
                        >
                          {opt}
                        </button>
                      );
                   })}
                </div>
             </div>

             {/* NEXT BUTTON */}
             {selected !== null && (
               <div className="mt-8 flex justify-end animate-[fadeIn_0.3s_ease-out]">
                  <button 
                    onClick={nextQuestion}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-purple-100 transition-colors"
                  >
                    {currentQ < QUESTIONS.length - 1 ? t.next : t.finish} <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
             )}
          </div>
        )}

        {/* RESULT SCREEN */}
        {status === 'result' && (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
              <Award className="w-24 h-24 text-yellow-400 mb-6 animate-bounce drop-shadow-[0_0_20px_gold]" />
              <h2 className="text-4xl font-black text-white mb-2">{t.finish}!</h2>
              <div className="text-gray-400 mb-6">{t.score}</div>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
                 {score}
              </div>
              <button 
                onClick={() => { onComplete(score); startGame(); }}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                 {t.claim}
              </button>
           </div>
        )}
        
      </div>
    </div>
  );
};

export default QuizGame;
