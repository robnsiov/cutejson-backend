import express from "express";
import {
  aboutMeInsertLike,
  aboutMeLikesCount,
} from "../controllers/about-me.js";

const aboutMeRouter = express.Router();

aboutMeRouter.post("/like", aboutMeInsertLike);
aboutMeRouter.get("/likes", aboutMeLikesCount);

export default aboutMeRouter;
