import { z } from "zod";

const createUserValidation = z.object({
  password: z.string().min(8).max(64),
  email: z.string().email(),
});

export { createUserValidation };
