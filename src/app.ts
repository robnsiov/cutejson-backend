import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

export default app;
