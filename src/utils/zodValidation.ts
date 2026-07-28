import { ZodSchema } from "zod";

export function validate<T>(
  schema: ZodSchema<any>,
  payload: unknown
): any {

  const result = schema.safeParse(payload);

  if (!result.success) {
    return result.error.issues
  }

  return result.data;
}