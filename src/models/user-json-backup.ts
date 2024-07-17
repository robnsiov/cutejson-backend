import mongoose from "mongoose";

const userJsonBackup = new mongoose.Schema(
  {
    db: {
      type: String,
      required: true,
    },
    write: {
      type: Number,
      required: true,
    },
    content: [{ date: Date, data: {} }],
  },
  { versionKey: false, timestamps: true }
);

const UserJsonBackup = mongoose.model("UserJsonBackup", userJsonBackup);

export default UserJsonBackup;
