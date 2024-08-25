import axios from "axios";
import { GOOGLE_REDIRECT_URL } from ".././constants/index.js";
import User from "../models/user.js";
import errorMessage from "../utils/error-message.js";
import ERROR_MESSAGES from ".././constants/errors.js";
import jwt from "jsonwebtoken";
import createRandomString from "../utils/random-string.js";

const googleAuth = (req, res) => {
  const { db } = req.query;
  const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${
    process.env.CLIENT_ID
  }&redirect_uri=${GOOGLE_REDIRECT_URL}&scope=email%20profile&state=${
    db ?? "none"
  }`;
  return res.redirect(authUrl);
};

const googleAuthCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL,
      grant_type: "authorization_code",
    });

    const { access_token } = response.data;

    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const email = userInfoResponse.data.email;
    const user = await User.findOne({ email });
    if (user) {
      const code = createRandomString(32);
      user.forgotPass = code;
      user.forgotPassexpiration = new Date(now.getTime() + 15 * 1000);
      await user.save();
      res.redirect(`http://127.0.0.1:3000/auth/finalize?code=${code}`);
    } else {
      const usr = await User.findOne({ db: state });
      if (usr) {
        usr.email = email;
        const code = createRandomString(32);
        usr.forgotPass = code;
        usr.forgotPassexpiration = new Date(now.getTime() + 15 * 1000);
        await usr.save();
        res.redirect(`http://127.0.0.1:3000/auth/finalize?code=${code}`);
      } else {
        return res
          .status(404)
          .json(errorMessage(ERROR_MESSAGES.INCORRECT_JSON_KEY));
      }
    }
  } catch (error) {
    res.redirect(
      `http://127.0.0.1:3000/auth/finalize?error=${ERROR_MESSAGES.AUTH_FAILED}`
    );
    // return res.status(401).send(errorMessage(ERROR_MESSAGES.AUTH_FAILED));
  }
};

export { googleAuth, googleAuthCallback };
