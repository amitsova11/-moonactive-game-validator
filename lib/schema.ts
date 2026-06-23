export const gameConfigSchema = {
  type: "object",
  required: [
    "level",
    "difficulty",
    "reward",
    "time_limit"
  ],
  properties: {
    level: {
      type: "integer",
      minimum: 1
    },
    difficulty: {
      type: "string",
      enum: ["easy", "medium", "hard"]
    },
    reward: {
      type: "number",
      minimum: 0
    },
    time_limit: {
      type: "integer",
      minimum: 1
    }
  },
  additionalProperties: false
};