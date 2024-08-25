import mongoose from "mongoose";

const contactUs = new mongoose.Schema(
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

const ContactUs = mongoose.model("ContactUs", contactUs);

export default ContactUs;
