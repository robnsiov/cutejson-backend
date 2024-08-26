import express from "express";
import contactUs from "../controllers/contact-us.js";
import asyncFunction from "../utils/async-handler.js";

const contactUsRouter = express.Router();

contactUsRouter.post("/", contactUs);

export default contactUsRouter;
