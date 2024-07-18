import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    db: String,
    // email, password are not required
    email: String,
    password: String,
    forgotPass: String,
    forgotPassexpiration: Date,
    json: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { versionKey: false, timestamps: true, minimize: false }
);

const User = mongoose.model("User", user);

export default User;
