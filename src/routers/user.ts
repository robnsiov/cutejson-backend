import express from "express";
import asyncHandler from "../utils/async-handler";
import { userSignin, userSignup } from "../controllers/user";
import DBIsExist from "../middlewares/db-is-exist";

const userRouter = express.Router();

userRouter.post(
  "/register/:db",
  asyncHandler(DBIsExist),
  asyncHandler(userSignup)
);

userRouter.post("/login", asyncHandler(userSignin));

export default userRouter;
