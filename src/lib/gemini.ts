import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

export const getFoodRecommendations = async (customerPreferences: string) => {
  if (!apiKey || apiKey === "DUMMY_KEY") {
    // Elegant mock fallback for demo purposes
    return `### Recommended for your mood: "${customerPreferences}"

1. **Galouti Kebab**: Melt-in-the-mouth smoked lamb patties infused with 160 secret spices. Perfect for a refined, soul-warming experience.
2. **Dal Makhani (Slow-Cooked)**: Simmered for 24 hours over charcoal. A rich, creamy classic that aligns with a comforting and luxurious palette.
3. **Saffron Jalebi with Rabri**: A royal dessert paired with condensed milk, offering a vibrant finish for those seeking a grand celebration.`;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(`You are an elite Indian culinary AI sommelier. Based on the customer's mood/preferences: "${customerPreferences}", recommend 3 specialized Indian dishes from a high-end menu (e.g., Galouti Kebab, Hyderabadi Dum Biryani, Saffron Jalebi, Paneer Tikka Angara, Dal Makhani etc). Give a brief high-end reason for each, focusing on regional heritage and spice profiles. Return response in Markdown.`);
    return response.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The culinary AI is currently resting. Please try again shortly.";
  }
};

export const getSalesInsights = async (salesData: any) => {
  if (!apiKey || apiKey === "DUMMY_KEY") {
    // Professional mock insights for demo purposes
    return `### Executive Operational Summary

- **High Velocity Capture**: Weekend revenue (Saturday/Sunday) shows a 35% surge compared to weekday averages. Recommend optimizing staff levels for the evening shifts.
- **Inventory Variance**: Saffron and Ghee consumption is trending above forecasted levels. Consider batch-adjusting prep orders for the upcoming festive cycle.
- **Action Item**: Implement a "Chef's Special" promotion on Tuesday/Wednesday to balance the mid-week culinary load.`;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(`Analyze this restaurant sales data and provide a professional, concise executive summary with 2 actionable insights for the manager: ${JSON.stringify(salesData)}. Format as Markdown.`);
    return response.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Executive summary generation paused. Neural link lost.";
  }
};
