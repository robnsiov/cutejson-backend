import ERROR_MESSAGES from ".././constants/errors.js";
import User from "../models/user.js";
import errorMessage from "../utils/error-message.js";

const DBIsExist = async (req, res, next) => {
  const db = req.headers["cute-json-token"];
  if (!db)
    return res
      .status(404)
      .send(errorMessage(ERROR_MESSAGES.PUT_JSON_KEY_IN_HEADER));
  req.params.db = db;
  const user = await User.findOne({ db: req.params.db });
  if (user) {
    req.user = user;
    return next();
  }
  return res.status(404).send(errorMessage(ERROR_MESSAGES.INCORRECT_JSON_KEY));
};

export default DBIsExist;
