import express from "express";
import userRouter from "./routers/user.js";
import errorMessage from "./utils/error-message.js";
import jsonDBRouter from "./routers/json-db.js";
import userJsonBackupRouter from "./routers/user-json-backup.js";

const app = express();

const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1MB in bytes
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

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(400).json(errorMessage("Bad request (processing)."));
});

app.use((req, res) => res.status(404).json(errorMessage("Bad path.")));

export default app;
