// Gemini отключён для стабильной прод-сборки без @google/genai.
// Позже можно вернуть оригинал.

export const generateMarketingText = async (prompt: string): Promise<string> => {
  console.warn("Gemini disabled. Prompt:", prompt);
  return "AI временно отключен. Скоро вернёмся с новыми фишками! 🍕";
};

export const generatePizzaImage = async (): Promise<string | null> => {
  console.warn("Gemini image generation disabled.");
  return null;
};

export const editPizzaImage = async (): Promise<string | null> => {
  console.warn("Gemini image editing disabled.");
  return null;
};
