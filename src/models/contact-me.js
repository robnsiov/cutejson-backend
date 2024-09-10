import mongoose from "mongoose";

const contactMe = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    files: [String],
  },
  { versionKey: false, timestamps: true }
);

const ContactMe = mongoose.model("ContactMe", contactMe);

export default ContactMe;
