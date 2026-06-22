import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateDescription = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const prompt = `Write a single, catchy, engaging, and professional marketing description (around 30-40 words) for a product named "${productName}". 
IMPORTANT RULE: Return ONLY the raw description text. Do not include any introductory words, options, titles, bullet points, or markdown formatting. Just the exact paragraph.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const description = result.response.text();
      return res.json({ description });
    } catch (firstError: any) {
      console.log(
        "⚠️ gemini-2.5-flash Failed, trying fallback: gemini-2.0-flash...",
      );

      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      const description = fallbackResult.response.text();
      return res.json({ description });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "AI Generation totally failed: " + error.message });
  }
};
