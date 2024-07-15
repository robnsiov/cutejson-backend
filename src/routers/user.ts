import express from "express";
import asyncHandler from "../utils/async-handler";
import {
  userForgotPass,
  userForgotPassConfirmation,
  userInfo,
  userSignin,
  userSignup,
} from "../controllers/user";
import DBIsExist from "../middlewares/db-is-exist";

const userRouter = express.Router();

userRouter.get("/", asyncHandler(userInfo));

userRouter.post(
  "/register/:db",
  asyncHandler(DBIsExist),
  asyncHandler(userSignup)
);

userRouter.post("/login", asyncHandler(userSignin));

userRouter.post("/forgot-pass", asyncHandler(userForgotPass));

userRouter.post(
  "/forgot-pass/confirmation",
  asyncHandler(userForgotPassConfirmation)
);

export default userRouter;
