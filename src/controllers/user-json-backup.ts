import { Request, Response } from "express";
import UserJsonBackup from "../models/user-json-backup";
import errorMessage from "../utils/error-message";
import defaultData from "../utils/json-db-default";

const userBackups = async (req: Request, res: Response) => {
  const { db } = req.params;
  const backup = await UserJsonBackup.findOne({ db });
  const dates: Array<any> = [];
  if (backup) {
    backup.content.forEach((bc) => dates.push(bc.date));
    return res.json(dates.sort((a, b) => a.getTime() - b.getTime()));
  }
  return res.status(400).json(errorMessage("User backup not found."));
};

const createUserBackup = async (db: string) => {
  await UserJsonBackup.create({
    db,
    write: 1,
    content: [{ data: defaultData, date: new Date() }],
  });
};

// 0 - 3 indexes
const getUserBackupByDate = async (req: Request, res: Response) => {
  const dateQ = parseInt(req.params.date);

  if (isNaN(dateQ)) return res.status(400).json(errorMessage("Bad date."));

  const date = new Date(+dateQ);

  const db = req.params.db;
  const backup = await UserJsonBackup.findOne({ db });

  let selected = null;

  if (backup) {
    backup.content.forEach((bc: any) => {
      if (bc.date.getTime() === date.getTime()) selected = bc;
    });
  }

  if (selected) res.json(selected);
  else res.status(400).json(errorMessage("Wrong date."));
};

const MAX_BACKOUP_COUNT = 4;

const updateUserBackup = async (db: string, data: any) => {
  const userBackup = await UserJsonBackup.findOne({ db });
  if (userBackup) {
    const writeIndex = userBackup.write;
    (userBackup.content[writeIndex] as any) = { data, date: new Date() };
    if (writeIndex === MAX_BACKOUP_COUNT - 1) {
      userBackup.write = 0;
    } else userBackup.write = writeIndex + 1;

    await userBackup.save();
  }
};

export { userBackups, getUserBackupByDate, createUserBackup, updateUserBackup };
