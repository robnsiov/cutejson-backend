import express from "express";
import {
  getUserBackupByDate,
  userBackups,
} from "../controllers/user-json-backup";
import DBIsExist from "../middlewares/db-is-exist";

const userJsonBackupRouter = express.Router();

userJsonBackupRouter.get("/:db", DBIsExist, userBackups);
userJsonBackupRouter.get("/:db/:date", DBIsExist, getUserBackupByDate);

export default userJsonBackupRouter;
