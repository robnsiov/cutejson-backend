import express from "express";
import createFakeData from "../controllers/faker.js";

const fakerRouter = express.Router();

fakerRouter.post("/", createFakeData);

export default fakerRouter;
