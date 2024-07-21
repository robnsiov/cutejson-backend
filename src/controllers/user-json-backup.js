import ERROR_MESSAGES from ".././constants/errors.js";
import { DEFAULT_JSON_DB, MAX_BACKOUP_COUNT } from ".././constants/index.js";
import UserJsonBackup from "../models/user-json-backup.js";
import errorMessage from "../utils/error-message.js";

const userBackups = async (req, res) => {
  const { db } = req.params;
  const backup = await UserJsonBackup.findOne({ db });
  const dates = [];
  if (backup) {
    backup.content.forEach((bc) => dates.push(bc.date));
    return res.json(dates.sort((a, b) => a.getTime() - b.getTime()));
  }
  return res.status(404).json(errorMessage(ERROR_MESSAGES.BACKUP_NOT_FOUND));
};

const createUserBackup = async (db) => {
  await UserJsonBackup.create({
    db,
    write: 1,
    content: [{ data: DEFAULT_JSON_DB, date: new Date() }],
  });
};

// 0 - 3 indexes
const getUserBackupByDate = async (req, res) => {
  const dateQ = parseInt(req.params.date);

  if (isNaN(dateQ))
    return res.status(404).json(errorMessage(ERROR_MESSAGES.DATE_NOT_FOUND));

  const date = new Date(+dateQ);

  const db = req.params.db;
  const backup = await UserJsonBackup.findOne({ db });

  let selected = null;

  if (backup) {
    backup.content.forEach((bc) => {
      if (bc.date.getTime() === date.getTime()) selected = bc;
    });
  }

  if (selected) res.json(selected);
  else res.status(404).json(errorMessage(ERROR_MESSAGES.DATE_NOT_FOUND));
};

const updateUserBackup = async (db, data) => {
  const userBackup = await UserJsonBackup.findOne({ db });
  if (userBackup) {
    const writeIndex = userBackup.write;
    userBackup.content[writeIndex] = { data, date: new Date() };
    if (writeIndex === MAX_BACKOUP_COUNT - 1) {
      userBackup.write = 0;
    } else userBackup.write = writeIndex + 1;

    await userBackup.save();
  }
};

export { userBackups, getUserBackupByDate, createUserBackup, updateUserBackup };
