import express from "express";
import userRouter from "./routers/user.js";
import errorMessage from "./utils/error-message.js";
import jsonDBRouter from "./routers/json-db.js";
import userJsonBackupRouter from "./routers/user-json-backup.js";
import fakerRouter from "./routers/faker.js";
import ERROR_MESSAGES from "../constants/errors.js";
import { MAX_BODY_SIZE } from "../constants/index.js";
import googleRouter from "./routers/google.js";

const app = express();

const flexibleBodyParser = (req, res, next) => {
  let data = "";
  let dataSize = 0;

  req.on("data", (chunk) => {
    dataSize += chunk.length;
    if (dataSize > MAX_BODY_SIZE) {
      res.status(413).send("Payload Too Large");
      req.connection.destroy();
      return;
    }
    data += chunk;
  });

  req.on("end", () => {
    if (data) {
      try {
        req.body = JSON.parse(data);
      } catch (e) {
        if (data === "null") {
          req.body = null;
        } else if (!isNaN(data)) {
          req.body = Number(data);
        } else {
          return res.status(400).send("Invalid data format");
        }
      }
    }
    next();
  });
};

app.use(flexibleBodyParser);

app.use("/user", userRouter);
app.use("/db", jsonDBRouter);
app.use("/backup", userJsonBackupRouter);
app.use("/faker", fakerRouter);
app.use("/auth/google", googleRouter);

app.use((err, req, res, next) => {
  return res.status(400).json(errorMessage(ERROR_MESSAGES.BAD_REQUEST));
});

app.use((req, res) =>
  res.status(404).json(errorMessage(ERROR_MESSAGES.URL_DOES_NOT_EXIST))
);

export default app;
