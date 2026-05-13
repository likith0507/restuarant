import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI(apiKey || "DUMMY_KEY");

export const getFoodRecommendations = async (customerPreferences: string) => {
  if (!apiKey) return "AI features require a GEMINI_API_KEY environment variable.";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(`You are an elite Indian culinary AI sommelier. Based on the customer's mood/preferences: "${customerPreferences}", recommend 3 specialized Indian dishes from a high-end menu (e.g., Galouti Kebab, Hyderabadi Dum Biryani, Saffron Jalebi, Paneer Tikka Angara, Dal Makhani etc). Give a brief high-end reason for each, focusing on regional heritage and spice profiles. Return response in Markdown.`);
    return response.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to get AI recommendations at this time.";
  }
};

export const getSalesInsights = async (salesData: any) => {
  if (!apiKey) return "Insights require an active Neural Link (API Key).";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(`Analyze this restaurant sales data and provide a professional, concise executive summary with 2 actionable insights for the manager: ${JSON.stringify(salesData)}. Format as Markdown.`);
    return response.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Forecasting currently unavailable.";
  }
};
