import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fallbackAnalysis = (message = "AI analysis temporarily unavailable.") => {
  return {
    atsScore: 0,
    summary: message,
    strongPoints: [],
    weakPoints: [
      "Gemini API quota exceeded or temporarily unavailable. Please try again later.",
    ],
    missingSkills: [],
    resumeMistakes: [],
    projectImprovements: [],
    suggestedRoles: [],
    interviewQuestions: [],
  };
};

const parseJsonSafely = (text) => {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON parse error:", error);

    return fallbackAnalysis(
      "AI returned an invalid response format. Please try again."
    );
  }
};

export const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `
Analyze this resume and return ONLY valid JSON.

Resume:
${resumeText}

Return JSON with this exact structure:
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
    "gemini-2.5-flash",
  ];

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

      const errorMessage = error.message || "";

      if (
        errorMessage.includes("429") ||
        errorMessage.includes("Too Many Requests") ||
        errorMessage.includes("quota")
      ) {
        continue;
      }

      if (
        errorMessage.includes("503") ||
        errorMessage.includes("Service Unavailable") ||
        errorMessage.includes("high demand")
      ) {
        continue;
      }
    }
  }

  return fallbackAnalysis(
    "AI analysis is temporarily unavailable because the Gemini API quota is exhausted. Please try again later or update the Gemini API key."
  );
};