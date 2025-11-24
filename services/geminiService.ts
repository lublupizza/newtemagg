
// Stubbed service for production build without Gemini dependency

// 1. Generate Text (Descriptions, Marketing copy)
export const generateMarketingText = async (prompt: string): Promise<string> => {
  return "AI временно отключен для оптимизации. Следите за обновлениями!";
};

// 2. Generate Image (Imagen 4.0)
export const generatePizzaImage = async (prompt: string, aspectRatio: string = '1:1'): Promise<string | null> => {
  return null;
};

// 3. Edit Image (Gemini 2.5 Flash Image - Nano Banana)
export const editPizzaImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  return null;
};
