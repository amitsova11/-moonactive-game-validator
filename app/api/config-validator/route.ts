import { analyzeGameConfig } from "@/lib/llm";
import { validateConfig } from "@/lib/validator";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      {
        schema_validation: {
          valid: false,
          errors: ["Invalid JSON body"],
        },
        llm_feedback: null,
      },
      { status: 400 },
    );
  }

  const validation = validateConfig(body);

  if (!validation.valid) {
    return Response.json(
      {
        schema_validation: {
          valid: false,
          errors: validation.errorMessages,
        },
        llm_feedback: "Game configuration is invalid. LLM feedback is not available.",
      },
    );
  }

  const llmFeedback = await analyzeGameConfig(body as object);

  return Response.json({
    schema_validation: {
      valid: true,
      errors: [],
    },
    llm_feedback: llmFeedback,
  });
}