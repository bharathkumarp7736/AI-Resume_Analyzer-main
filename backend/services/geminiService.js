import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseJsonSafely = (text) => {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

export const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `
Analyze this resume and return ONLY valid JSON.

Resume:
${resumeText}

Return JSON with:
{
  "atsScore": number,
  "summary": string,
  "strongPoints": string[],
  "weakPoints": string[],
  "missingSkills": string[],
  "resumeMistakes": string[],
  "projectImprovements": string[],
  "suggestedRoles": string[],
  "interviewQuestions": string[]
}
`;

  const models = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-flash"
  ];

  let lastError;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return parseJsonSafely(text);
    } catch (error) {
      console.error(`Gemini failed with ${modelName}:`, error.message);
      lastError = error;
    }
  }

  throw new Error(
    lastError?.message || "All Gemini models failed. Please try again later."
  );
};