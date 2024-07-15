import express from "express";
import userRouter from "./routers/user";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use("/user", userRouter);

export default app;
