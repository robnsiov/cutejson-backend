import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routers/user";
import errorMessage from "./utils/error-message";
import jsonDBRouter from "./routers/json-db";
import userJsonBackupRouter from "./routers/user-json-backup";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use("/user", userRouter);
app.use("/db", jsonDBRouter);
app.use("/backup", userJsonBackupRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.status(400).json(errorMessage("Bad request (processing)."));
});

app.use((req: Request, res: Response) =>
  res.status(404).json(errorMessage("Bad path."))
);

export default app;
