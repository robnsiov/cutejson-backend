import axios from "axios";
import errorMessage from "../utils/error-message.js";
import ERROR_MESSAGES from ".././constants/errors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import createRandomString from "../utils/random-string.js";
import { FRONT_BASE_URL, GITHUB_URL } from "../constants/index.js";

const githubAuth = (req, res) => {
  const { db } = req.query;
  res.redirect(
    `${GITHUB_URL}/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&state=${db ?? "none"}`
  );
};

const githuAuthCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const response = await axios({
      method: "post",
      url: `${GITHUB_URL}/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
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
      url: `${GITHUB_URL}/user`,
      headers: {
        Authorization: `token ${access}`,
      },
    });
    const email = response.data.email;
    const user = await User.findOne({ email });
    if (user) {
      const code = createRandomString(32);
      const now = new Date();
      user.forgotPass = code;
      user.forgotPassexpiration = new Date(now.getTime() + 15 * 1000);
      await user.save();
      res.redirect(`${FRONT_BASE_URL}/auth/finalize?code=${code}`);
    } else {
      const usr = await User.findOne({ db: state });
      if (usr) {
        usr.email = email;
        const code = createRandomString(32);
        usr.forgotPass = code;
        usr.forgotPassexpiration = new Date(now.getTime() + 15 * 1000);
        await usr.save();
        res.redirect(`${FRONT_BASE_URL}/auth/finalize?code=${code}`);
      } else {
        return res
          .status(404)
          .json(errorMessage(ERROR_MESSAGES.INCORRECT_JSON_KEY));
      }
    }
  } catch (err) {
    res.redirect(
      `${FRONT_BASE_URL}/auth/finalize?error=${ERROR_MESSAGES.AUTH_FAILED}`
    );
    // return res.status(401).send(errorMessage(ERROR_MESSAGES.AUTH_FAILED));
  }
};

export { githuAuthCallback, githubAuthSuccess, githubAuth };
