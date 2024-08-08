import axios from "axios";
import errorMessage from "../utils/error-message.js";
import ERROR_MESSAGES from ".././constants/errors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const githubAuth = (req, res) => {
  const { db } = req.query;
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&state=${db ?? "none"}`
  );
};

const githuAuthCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const response = await axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
      headers: {
        accept: "application/json",
      },
    });
    res.redirect(
      `/auth/github/success?access=${response.data.access_token}&state=${state}`
    );
  } catch (err) {
    return res.status(401).send(errorMessage(ERROR_MESSAGES.AUTH_FAILED));
  }
};

const githubAuthSuccess = async (req, res) => {
  const { access, state } = req.query;
  try {
    const response = await axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: `token ${access}`,
      },
    });
    const email = response.data.email;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      });
      res.redirect(
        `http://127.0.0.1:3000/auth/finalize?email=${email}&token=${token}&db=${user.db}`
      );
      // return res.status(200).json({ token: token, db: user.db });
    } else {
      const usr = await User.findOne({ db: state });
      if (usr) {
        const token = jwt.sign({ id: usr._id }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });
        usr.email = email;
        await usr.save();
        res.redirect(
          `http://127.0.0.1:3000/auth/finalize?email=${email}&token=${token}&db=${user.db}`
        );
        // return res.status(201).json({ email, token: token });
      } else {
        return res
          .status(404)
          .json(errorMessage(ERROR_MESSAGES.INCORRECT_JSON_KEY));
      }
    }
  } catch (err) {
    res.redirect(
      `http://127.0.0.1:3000/auth/finalize?error=${ERROR_MESSAGES.AUTH_FAILED}`
    );
    // return res.status(401).send(errorMessage(ERROR_MESSAGES.AUTH_FAILED));
  }
};

export { githuAuthCallback, githubAuthSuccess, githubAuth };
