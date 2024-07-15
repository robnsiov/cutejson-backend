import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import errorMessage from "../utils/error-message";

const DBIsExist = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ db: req.params.db });
  if (user) {
    req.user = user;
    return next();
  }
  return res.status(404).send(errorMessage("Wrong db."));
};

export default DBIsExist;
