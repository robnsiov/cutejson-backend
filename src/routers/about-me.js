import express from "express";
import {
  aboutMeInsertLike,
  aboutMeLikesCount,
} from "../controllers/about-me.js";

const aboutMeRouter = express.Router();

aboutMeRouter.post("/", aboutMeInsertLike);
aboutMeRouter.get("/", aboutMeLikesCount);

export default aboutMeRouter;
