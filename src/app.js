import express from "express";
import userRouter from "./routers/user.js";
import errorMessage from "./utils/error-message.js";
import jsonDBRouter from "./routers/json-db.js";
import userJsonBackupRouter from "./routers/user-json-backup.js";
import fakerRouter from "./routers/faker.js";
import ERROR_MESSAGES from "./constants/errors.js";
import { MAX_BODY_SIZE } from "./constants/index.js";
import googleRouter from "./routers/google.js";
import githubRouter from "./routers/github.js";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import flexibleBodyParser from "./middlewares/body-parser.js";
import contactUsRouter from "./routers/contact-us.js";
import fileUpload from "express-fileupload";
import aboutMeRouter from "./routers/about-me.js";

const app = express();

app.use(cors());
app.use(fileUpload());

app.use(flexibleBodyParser);
app.use(mongoSanitize());

app.use("/user", userRouter);
app.use("/db", jsonDBRouter);
app.use("/backup", userJsonBackupRouter);
app.use("/faker", fakerRouter);
app.use("/auth/google", googleRouter);
app.use("/auth/github", githubRouter);
app.use("/contact-us", contactUsRouter);
app.use("/about-me", aboutMeRouter);

app.use((err, req, res, next) => {
  return res.status(400).json(errorMessage(ERROR_MESSAGES.BAD_REQUEST));
});

app.use((req, res) =>
  res.status(404).json(errorMessage(ERROR_MESSAGES.URL_DOES_NOT_EXIST))
);

export default app;
