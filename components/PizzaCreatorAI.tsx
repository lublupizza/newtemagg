import React, { useState, useRef } from 'react';
import { generatePizzaImage, editPizzaImage, generateMarketingText } from '../services/geminiService';
import { Wand2, Image as ImageIcon, Loader2, Download, Share2, Camera } from 'lucide-react';
import { Language } from '../types';

interface PizzaCreatorAIProps {
  language: Language;
}

const PizzaCreatorAI: React.FC<PizzaCreatorAIProps> = ({ language }) => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [aiDescription, setAiDescription] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translations
  const t = {
    title: language === 'ru' ? 'AI Пицца Студия' : 'AI Pizza Studio',
    subtitle: language === 'ru' ? 'Создавай будущее или меняй настоящее.' : 'Design the future or remix the present.',
    tabCreate: language === 'ru' ? 'Создать Новую (Imagen 4)' : 'Create New (Imagen 4)',
    tabEdit: language === 'ru' ? 'Редактировать (Gemini Nano)' : 'Edit Photo (Gemini Nano Banana)',
    uploadText: language === 'ru' ? 'Нажмите для загрузки фото' : 'Click to upload photo',
    promptLabelGen: language === 'ru' ? 'Опишите пиццу вашей мечты' : 'Describe your dream pizza',
    promptLabelEdit: language === 'ru' ? 'Что нужно изменить?' : 'What should we change?',
    phGen: language === 'ru' ? 'например, Пицца с космической пылью и неоновым сыром...' : 'e.g., A pizza with cosmic dust toppings and neon cheese...',
    phEdit: language === 'ru' ? 'например, Добавь ретро фильтр, больше пепперони...' : 'e.g., Add a retro filter, add more pepperoni...',
    ratio: language === 'ru' ? 'Соотношение' : 'Aspect Ratio',
    btnGenerate: language === 'ru' ? 'Магическая Генерация' : 'Magic Generate',
    processing: language === 'ru' ? 'Обработка...' : 'Processing...',
    emptyState: language === 'ru' ? 'Ваш шедевр появится здесь' : 'Your creation will appear here',
    analysis: language === 'ru' ? 'AI Анализ' : 'AI Analysis',
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setAiDescription('');
    try {
      // Parallel requests for efficiency
      const [imgUrl, desc] = await Promise.all([
        generatePizzaImage(prompt + " hyper-realistic, delicious pizza, food photography", aspectRatio),
        generateMarketingText(
           language === 'ru' 
           ? `Напиши короткое описание из 2 предложений для пиццы под названием "${prompt}". Сделай это захватывающе и футуристично. На русском языке.`
           : `Write a catchy, 2-sentence description for a pizza called "${prompt}". Make it sound exciting and futuristic.`
        )
      ]);
      
      setResultImage(imgUrl);
      setAiDescription(desc);
    } catch (e) {
      alert("Failed to generate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!prompt || !uploadImage) return;
    setLoading(true);
    try {
      const editedUrl = await editPizzaImage(uploadImage, prompt);
      setResultImage(editedUrl);
      const desc = await generateMarketingText(
        language === 'ru'
        ? `Опиши это изображение пиццы с изменением: ${prompt}. Коротко и смешно. На русском языке.`
        : `Describe this edited pizza image with the change: ${prompt}. Short and funny.`
      );
      setAiDescription(desc);
    } catch (e) {
      alert("Editing failed. Ensure the image is clear.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Wand2 className="w-8 h-8" /> {t.title}
          </h2>
          <p className="text-pink-100">{t.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              mode === 'generate' ? 'bg-gray-800 text-pink-500 border-b-2 border-pink-500' : 'bg-gray-900 text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.tabCreate}
          </button>
          <button
             onClick={() => setMode('edit')}
             className={`flex-1 py-4 text-center font-medium transition-colors ${
               mode === 'edit' ? 'bg-gray-800 text-blue-500 border-b-2 border-blue-500' : 'bg-gray-900 text-gray-500 hover:text-gray-300'
             }`}
           >
             {t.tabEdit}
           </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {mode === 'edit' && (
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/50 transition-all h-48 flex flex-col items-center justify-center"
               >
                 {uploadImage ? (
                   <img src={uploadImage} alt="Upload" className="h-full w-full object-contain rounded" />
                 ) : (
                   <>
                     <Camera className="w-10 h-10 text-gray-400 mb-2" />
                     <p className="text-gray-400 text-sm">{t.uploadText}</p>
                   </>
                 )}
                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
               </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {mode === 'generate' ? t.promptLabelGen : t.promptLabelEdit}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'generate' ? t.phGen : t.phEdit}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none h-32 resize-none"
              />
            </div>

            {mode === 'generate' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.ratio}</label>
                <div className="flex gap-2">
                  {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-4 py-2 rounded-lg text-sm font-mono ${
                        aspectRatio === ratio ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={mode === 'generate' ? handleGenerate : handleEdit}
              disabled={loading || (!uploadImage && mode === 'edit')}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center shadow-lg transition-all ${
                loading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-pink-500/25'
              }`}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
              {loading ? t.processing : t.btnGenerate}
            </button>
          </div>

          {/* Result */}
          <div className="bg-black/50 rounded-xl border border-gray-700 flex flex-col items-center justify-center min-h-[400px] relative group">
            {resultImage ? (
              <>
                 <img src={resultImage} alt="Generated" className="w-full h-full object-contain rounded-xl" />
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-end gap-2">
                        <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"><Download className="w-4 h-4" /></button>
                        <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"><Share2 className="w-4 h-4" /></button>
                    </div>
                 </div>
              </>
            ) : (
              <div className="text-center p-8">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">{t.emptyState}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* AI Description Output */}
        {aiDescription && (
          <div className="bg-gray-900/50 p-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 uppercase font-bold mb-1">{t.analysis}</p>
            <p className="text-lg text-pink-200 italic">"{aiDescription}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaCreatorAI;