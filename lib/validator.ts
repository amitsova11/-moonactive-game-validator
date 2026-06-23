import Ajv, { ErrorObject } from "ajv";
import { gameConfigSchema } from "./schema";

const ajv = new Ajv({
  allErrors: true,
  strict: false, 
});

const validateFn = ajv.compile(gameConfigSchema);

export type ValidationResult = {
  valid: boolean;
  errors: ErrorObject[] | null;
  errorMessages: string[];
};

export function validateConfig(data: unknown): ValidationResult {
  const valid = validateFn(data);

  const errors = validateFn.errors ?? [];

  // Human-readable error messages (useful for UI + debugging)
  const errorMessages = errors.map((err) => {
    const field = err.instancePath ? err.instancePath.replace("/", "") : "root";
    return `${field} ${err.message}`;
  });

  return {
    valid: !!valid,
    errors,
    errorMessages,
  };
}