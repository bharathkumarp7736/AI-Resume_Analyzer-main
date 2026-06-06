import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("Loaded Gemini Key:", apiKey ? "Key found" : "undefined");

const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeResumeWithAI = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert ATS resume analyzer.

Analyze this resume for a fresher software developer role.

Return only valid JSON. Do not use markdown.

JSON format:
{
  "atsScore": 85,
  "summary": "Short summary",
  "strongPoints": ["point 1", "point 2"],
  "weakPoints": ["point 1", "point 2"],
  "missingSkills": ["skill 1", "skill 2"],
  "resumeMistakes": ["mistake 1", "mistake 2"],
  "projectImprovements": ["improvement 1", "improvement 2"],
  "suggestedRoles": ["role 1", "role 2"],
  "interviewQuestions": ["question 1", "question 2"]
}

Resume text:
${resumeText}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Full Error:", error);
    throw new Error(error.message);
  }
};