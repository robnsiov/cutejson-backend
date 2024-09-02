import ERROR_MESSAGES from "../constants/errors.js";
import AboutMe from "../models/about-me.js";
import errorMessage from "../utils/error-message.js";
import { AboutMeGetLike, AboutMeInsertLike } from "../validations/user.js";

const aboutMeInsertLike = async (req, res) => {
  try {
    const { db } = await AboutMeInsertLike.parseAsync(req.body);
    const am = await AboutMe.findOne({ db });
    if (!am) await AboutMe.create({ db });
    else await AboutMe.findOneAndDelete({ db });
    return res.status(201).json({});
  } catch (err) {
    if (err.issues)
      return res.status(400).json({ errors: errorMessage(err.issues) });
    return res.status(500).json(errorMessage(ERROR_MESSAGES.BAD_REQUEST));
  }
};

const aboutMeLikesCount = async (req, res) => {
  try {
    const { db } = await AboutMeGetLike.parseAsync(req.query);
    const am = await AboutMe.findOne({ db });
    const count = await AboutMe.countDocuments();
    return res.json({ count, like: !!am });
  } catch (err) {
    if (err.issues)
      return res.status(400).json({ errors: errorMessage(err.issues) });
    return res.status(500).json(errorMessage(ERROR_MESSAGES.BAD_REQUEST));
  }
};
export { aboutMeInsertLike, aboutMeLikesCount };
