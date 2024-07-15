import mongoose from "mongoose";

const userJsonBackup = new mongoose.Schema(
  {
    db: String,
    write: Number,
    content: [{ date: Date, data: {} }],
  },
  { versionKey: false, timestamps: true }
);

const Backup = mongoose.model("UserJsonBackup", userJsonBackup);

export default Backup;
