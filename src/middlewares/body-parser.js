import { MAX_BODY_SIZE } from "../constants/index.js";
import express from "express";
const app = express();

const flexibleBodyParser = (req, res, next) => {
  if (req.originalUrl === "/contact-me") {
    express.json()(req, res, next);
    // next();
  } else {
    let data = "";
    let dataSize = 0;

    req.on("data", (chunk) => {
      dataSize += chunk.length;
      if (dataSize > MAX_BODY_SIZE) {
        res.status(413).send("Payload Too Large");
        req.connection.destroy();
        return;
      }
      data += chunk;
    });

    req.on("end", () => {
      if (data) {
        try {
          req.body = JSON.parse(data);
        } catch (e) {
          if (data === "null") {
            req.body = null;
          } else if (!isNaN(data)) {
            req.body = Number(data);
          } else {
            return res.status(400).send("Invalid data format");
          }
        }
      }
      next();
    });
  }
};

export default flexibleBodyParser;
