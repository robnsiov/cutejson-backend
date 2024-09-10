import express from "express";
import contactMe from "../controllers/contact-me.js";
import asyncFunction from "../utils/async-handler.js";

const contactMeRouter = express.Router();

contactMeRouter.post("/", contactMe);

export default contactMeRouter;
