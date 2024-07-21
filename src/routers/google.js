import express from "express";
import { googleAuth, googleAuthCallback } from "../controllers/google.js";

const googleRouter = express.Router();

googleRouter.get("/", googleAuth);
googleRouter.get("/callback", googleAuthCallback);

export default googleRouter;
