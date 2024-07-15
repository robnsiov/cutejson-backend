import { z } from "zod";

const createUserValidation = z.object({
  password: z.string().min(8).max(64),
  email: z.string().email(),
});

const userSigninValidation = z.object({
  password: z.string().min(8).max(64),
  email: z.string().email(),
});

const userForgotPassValidation = z.object({
  email: z.string().email(),
});

const userForgotPassConfirmationValidation = z
  .object({
    recoveryString: z.string().length(36),
    password: z.string().min(8).max(64),
    confirmPassword: z.string().min(8).max(64),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match.",
      });
    }
  });

export {
  createUserValidation,
  userSigninValidation,
  userForgotPassValidation,
  userForgotPassConfirmationValidation,
};
