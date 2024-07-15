import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    db: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    json: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { versionKey: false, timestamps: true, minimize: false }
);

const User = mongoose.model("User", user);

export default User;
