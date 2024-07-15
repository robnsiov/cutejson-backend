import express from "express";
import asyncHandler from "../utils/async-handler";
import { userSignup } from "../controllers/user";
import DBIsExist from "../middlewares/db-is-exist";

const userRouter = express.Router();

userRouter.post(
  "/register/:db",
  asyncHandler(DBIsExist),
  asyncHandler(userSignup)
);

export default userRouter;
