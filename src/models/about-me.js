import mongoose from "mongoose";

const aboutMe = new mongoose.Schema(
  {
    db: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const AboutMe = mongoose.model("AboutMe", aboutMe);

export default AboutMe;
