import errorMessage from "../utils/error-message.js";
import ERROR_MESSAGES from ".././constants/errors.js";
import ContactUs from "../models/contact-us.js";
import { contactUsValidation } from "../validations/user.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import createRandomString from "../utils/random-string.js";
dotenv.config();

const client = new S3Client({
  region: "default",
  endpoint: "https://" + process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

const contactUs = async (req, res) => {
  const uploadFile = async (file) => {
    const name = `${createRandomString(10)}-${file.name}`;
    const params = {
      Body: file.data,
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: name,
    };
    await client.send(new PutObjectCommand(params));
    return name;
  };

  try {
    const { email, message } = req.body;
    const data = await contactUsValidation.parseAsync({ email, message });

    let uploadedFiles = [];
    if (req.files && req.files.file) {
      if (Array.isArray(req.files.file)) {
        uploadedFiles = await Promise.all(req.files.file.map(uploadFile));
      } else {
        const fileName = await uploadFile(req.files.file);
        uploadedFiles.push(fileName);
      }
    }

    await ContactUs.create({ email, message, files: uploadedFiles });

    return res.json({
      message: "Contact message sent successfully.",
    });
  } catch (err) {
    if (err.issues)
      return res.status(400).json({ errors: errorMessage(err.issues) });
    return res.status(500).json(errorMessage(ERROR_MESSAGES.BAD_REQUEST));
  }
};

export default contactUs;
