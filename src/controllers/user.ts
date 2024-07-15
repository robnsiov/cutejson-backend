import { NextFunction, Request, Response } from "express";
import {
  createUserValidation,
  userSigninValidation,
} from "../validations/user";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import errorMessage from "../utils/error-message";
import { UserSigninBody, UserSignupBody } from "../types/user";
import User from "../models/user";

const userSignup = async (
  req: Request<{}, {}, UserSignupBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const body = await createUserValidation.parseAsync({ email, password });
    if (req.user.email)
      return res.status(400).json(errorMessage("Bad request."));
    const hash = await argon2.hash(password);
    const user = req.user;
    user.email = body.email;
    user.password = hash;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    res.status(201).json({ email: body.email, token: token });
  } catch (err: any) {
    if (err.issues) res.status(400).json(errorMessage(err.issues));
    else next(err);
  }
};

const userSignin = async (
  req: Request<{}, {}, UserSigninBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const body = await userSigninValidation.parseAsync({ email, password });
    const user = await User.findOne({ email: body.email });
    if (!user) return res.status(400).json(errorMessage("Wrong inputs."));

    try {
      if (await argon2.verify(user.password, password)) {
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET!, {
          expiresIn: process.env.JWT_EXPIRES,
        });
        return res.status(200).json({ token: token, db: user.db });
      } else {
        return res.status(400).json(errorMessage("Wrong inputs."));
      }
    } catch (err) {
      return res.status(400).json(errorMessage("Wrong inputs."));
    }
  } catch (err: any) {
    if (err.issues) res.status(400).json(errorMessage(err.issues));
    else next(err);
  }
};

export { userSignup, userSignin };
