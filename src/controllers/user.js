import {
  createUserValidation,
  userForgotPassConfirmationValidation,
  userForgotPassValidation,
  userSigninValidation,
} from "../validations/user.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import errorMessage from "../utils/error-message.js";

import User from "../models/user.js";
import createRandomString from "../utils/random-string.js";
import ERROR_MESSAGES from ".././constants/errors.js";

const userSignup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const body = await createUserValidation.parseAsync({ email, password });
    if (req.user.email)
      return res.status(400).json(errorMessage(ERROR_MESSAGES.USER_EXIST));
    const hash = await argon2.hash(password);
    const user = req.user;
    user.email = body.email;
    user.password = hash;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    res.status(201).json({ email: body.email, token: token });
  } catch (err) {
    if (err.issues) res.status(400).json(errorMessage(err.issues));
    else next(err);
  }
};

const userSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const body = await userSigninValidation.parseAsync({ email, password });
    const user = await User.findOne({ email: body.email });
    if (!user)
      return res
        .status(401)
        .json(errorMessage(ERROR_MESSAGES.INCORRECT_EMAIL_PASSWORD));

    try {
      if (await argon2.verify(user.password, password)) {
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });
        return res.status(200).json({ token: token, db: user.db });
      } else {
        return res
          .status(401)
          .json(errorMessage(ERROR_MESSAGES.INCORRECT_EMAIL_PASSWORD));
      }
    } catch (err) {
      return res
        .status(401)
        .json(errorMessage(ERROR_MESSAGES.INCORRECT_EMAIL_PASSWORD));
    }
  } catch (err) {
    if (err.issues) res.status(400).json(errorMessage(err.issues));
    else next(err);
  }
};

const userForgotPass = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await userForgotPassValidation.parseAsync({ email });
    const user = await User.findOne({ email: data.email });
    if (!user)
      return res.status(400).json(errorMessage(ERROR_MESSAGES.USER_NOT_FOUND));
    user.forgotPass = createRandomString(36);
    const now = new Date();
    user.forgotPassexpiration = new Date(now.getTime() + 5 * 60000);
    await user.save();
    // send email
    res.json({ message: "Confirmation email has been sent." });
  } catch (err) {
    if (err.issues) res.status(400).json(errorMessage(err.issues));
    else next(err);
  }
};

const userForgotPassConfirmation = async (req, res, next) => {
  const { recoveryString, password, confirmPassword } = req.body;
  try {
    const data = await userForgotPassConfirmationValidation.parseAsync({
      recoveryString,
      confirmPassword,
      password,
    });
    const user = await User.findOne({ forgotPass: data.recoveryString });

    if (!user)
      return res.status(400).json(errorMessage(ERROR_MESSAGES.USER_NOT_FOUND));

    const now = new Date();
    if (
      user.forgotPassexpiration &&
      now.getTime() > user.forgotPassexpiration.getTime()
    ) {
      user.forgotPass = null;
      user.forgotPassexpiration = null;
      await user.save();
      return res.status(400).json(errorMessage(ERROR_MESSAGES.EXPIRED_REQUEST));
    }

    const hash = await argon2.hash(password);
    user.password = hash;
    user.forgotPass = null;
    user.forgotPassexpiration = null;
    await user.save();
    res.json({});
  } catch (err) {
    if (err.issues) res.status(400).json(errorMessage(err.issues));
    else next(err);
  }
};

const userInfo = (req, res) => {
  res.json({ email: req.user.email, db: req.user.db });
};

export {
  userSignup,
  userSignin,
  userForgotPass,
  userForgotPassConfirmation,
  userInfo,
};
