import { GoogleGenAI } from "@google/genai";

import { getGeminiApiKey } from "@/lib/env";

export async function generateSummary({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

  const prompt = [
    "Write a concise blog summary in about 180 to 220 words.",
    "It should be informative, polished, and suitable for a blog listing card.",
    "Do not use bullet points, markdown, or headings.",
    `Title: ${title}`,
    `Body: ${body}`,
  ].join("\n\n");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text?.trim() ?? "";
}
