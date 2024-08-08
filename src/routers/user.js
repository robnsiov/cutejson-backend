import express from "express";
import asyncHandler from "../utils/async-handler.js";
import {
  userForgotPass,
  userForgotPassConfirmation,
  userInfo,
  userSignin,
  userSignup,
} from "../controllers/user.js";
import DBIsExist from "../middlewares/db-is-exist.js";
import isAuth from "../middlewares/is-auth.js";

const userRouter = express.Router();

userRouter.get("/", isAuth, userInfo);

userRouter.post("/signup", asyncHandler(DBIsExist), asyncHandler(userSignup));

userRouter.post("/signin", asyncHandler(userSignin));

userRouter.post("/forgot-pass", asyncHandler(userForgotPass));

userRouter.post(
  "/forgot-pass/confirmation",
  asyncHandler(userForgotPassConfirmation)
);

export default userRouter;
