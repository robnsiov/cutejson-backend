import express from "express";
import {
  githuAuthCallback,
  githubAuth,
  githubAuthSuccess,
} from "../controllers/github.js";

const githubRouter = express.Router();

githubRouter.get("/", githubAuth);
githubRouter.get("/callback", githuAuthCallback);
githubRouter.get("/success", githubAuthSuccess);

export default githubRouter;
