import express from "express";
import asyncHandler from "../utils/async-handler";
import { userForgotPass, userSignin, userSignup } from "../controllers/user";
import DBIsExist from "../middlewares/db-is-exist";

const userRouter = express.Router();

userRouter.post(
  "/register/:db",
  asyncHandler(DBIsExist),
  asyncHandler(userSignup)
);

userRouter.post("/login", asyncHandler(userSignin));
userRouter.post("/forgot-pass", asyncHandler(userForgotPass));

export default userRouter;
