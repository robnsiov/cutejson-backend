import ERROR_MESSAGES from "../constants/errors.js";
import User from "../models/user.js";
import errorMessage from "../utils/error-message.js";
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json(errorMessage(ERROR_MESSAGES.TOKEN_NOT_FOUND));

  if (!authHeader.startsWith(authHeader))
    return res
      .status(400)
      .json(errorMessage(ERROR_MESSAGES.USE_BEARER_IN_TOKEN));
  const token = authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json(errorMessage(ERROR_MESSAGES.TOKEN_NOT_FOUND));
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, jwtUser) => {
    if (err)
      return res
        .status(403)
        .json(errorMessage(ERROR_MESSAGES.EXPIRED_OR_INVALID_TOKEN));

    const user = await User.findOne({ _id: jwtUser.id });
    if (user) {
      req.user = user;
      return next();
    }
    return res.status(400).json(errorMessage(ERROR_MESSAGES.USER_NOT_FOUND));
  });
};

export default isAuth;
