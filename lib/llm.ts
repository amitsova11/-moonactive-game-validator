import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export type LlmFeedback = {
  analysis: string;
  suggested_actions: string[];
};

function parseJsonObject(text: string): unknown {
  const fencedJson = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedJson?.[1]) {
    return JSON.parse(fencedJson[1].trim());
  }

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  }

  return JSON.parse(text);
}

function toLlmFeedback(payload: unknown): LlmFeedback {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "analysis" in payload &&
    "suggested_actions" in payload &&
    typeof (payload as { analysis: unknown }).analysis === "string" &&
    Array.isArray((payload as { suggested_actions: unknown }).suggested_actions)
  ) {
    const suggestedActions = (payload as { suggested_actions: unknown[] }).suggested_actions
      .filter((item): item is string => typeof item === "string");

    return {
      analysis: (payload as { analysis: string }).analysis,
      suggested_actions: suggestedActions,
    };
  }

  return {
    analysis: "Could not generate structured feedback.",
    suggested_actions: [],
  };
}

export async function analyzeGameConfig(config: object): Promise<LlmFeedback> {
  const prompt = `
    You are a senior game designer.

    Analyze the following configuration.

    Fields:
    -level — the game level number, representing progression (higher levels are harder).
    -difficulty — a string indicating the level's difficulty, e.g., “easy”, “medium”, or “hard”.
    -reward — the amount of in-game currency or points granted for completing the level.
    -time_limit — the time (in seconds) allocated to complete the level. This controls pacing and challenge.


    Reference Balancing Ranges:

    Easy levels generally have rewards in the range of 100–500 and time limits of at least 30 seconds.
    Medium levels typically offer rewards between 500–2000 with time limits around 20–60 seconds.
    Hard levels usually grant rewards of 2000–5000 with tighter time limits, often between 10–30 seconds.


    Evaluate:
    - reward balance
    - level consistency 
    - time balance
    - reward consistency

    Provide your analysis and suggest any adjustments to improve the game experience.

    Return ONLY valid JSON:

    {
      "analysis": "...",
      "suggested_actions": [
        "..."
      ]
    }

    Configuration:
    ${JSON.stringify(config, null, 2)}
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text ?? "{}";

    try {
      return toLlmFeedback(parseJsonObject(rawText));
    } catch {
      return {
        analysis: "Could not parse model response.",
        suggested_actions: [],
      };
    }
  }
  catch (error) {
    console.error("Error during LLM analysis:", error);
    return {
      analysis: "An error occurred while analyzing the configuration.",
      suggested_actions: [],
    };
  }
}