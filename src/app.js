import express from "express";
import userRouter from "./routers/user.js";
import errorMessage from "./utils/error-message.js";
import jsonDBRouter from "./routers/json-db.js";
import userJsonBackupRouter from "./routers/user-json-backup.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use("/user", userRouter);
app.use("/db", jsonDBRouter);
app.use("/backup", userJsonBackupRouter);

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(400).json(errorMessage("Bad request (processing)."));
});

app.use((req, res) => res.status(404).json(errorMessage("Bad path.")));

export default app;
