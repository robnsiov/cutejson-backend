import { connect } from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 8086;

const connectToDB = async () => {
  try {
    await connect(process.env.DB);
    console.log("DB connected.");
  } catch (err) {
    console.log("DB error :", err);
  }
};

connectToDB();

app.listen(port, () => {
  console.log(`App is working on port ${port}.`);
});
