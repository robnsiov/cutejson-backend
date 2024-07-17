import { Request, Response } from "express";
import createRandomString from "../utils/random-string";
import User from "../models/user";
import defaultData from "../utils/json-db-default";
import isObject from "../utils/is-object";
import errorMessage from "../utils/error-message";
import { cloneDeep } from "lodash";
import { createUserBackup, updateUserBackup } from "./user-json-backup";

const createJsonDB = async (req: Request, res: Response) => {
  const randomNumer = createRandomString(36);
  await User.create({ db: randomNumer, json: defaultData });
  await createUserBackup(randomNumer);
  res.status(201).send({ db: randomNumer });
};

const readDatabase = async (req: Request, res: Response) => {
  const user = req.user;
  res.json(user.json);
};

const editDatabase = async (req: Request, res: Response) => {
  const body = req.body;
  if (!isObject(body))
    return res
      .status(400)
      .send(errorMessage("Send an object not another data types."));

  const user = req.user;
  user.json = req.body;
  await user.save();

  //   await updateUserBackup(req.params.db, body);
  res.json(body);
};

const clearJsonDB = async (req: Request, res: Response) => {
  const user = req.user;
  user.json = {};
  await user.save();
  await updateUserBackup(req.params.db, {});
  res.json({});
};

const getDataByKey = async (req: Request, res: Response) => {
  res.json({});
};

const deleteDataByKey = async (req: Request, res: Response) => {
  const user = req.user;
  const json = cloneDeep(user.json);
  //   await updateUserBackup(req.params.db, json);
  return res.json({});
};

const postDataByKey = async (req: Request, res: Response) => {
  const user = req.user;
  const json = cloneDeep(user.json);
  //   await updateUserBackup(req.params.db, json);
  res.status(201).json({});
};

const patchDataByKey = async (req: Request, res: Response) => {
  const user = req.user;
  const json = cloneDeep(user.json);

  //   await updateUserBackup(req.params.db, json);
  return res.json({});
};
const putDataByKey = async (req: Request, res: Response) => {
  const user = req.user;
  const json = cloneDeep(user.json);

  //   await updateUserBackup(req.params.db, json);
  return res.json({});
};

export {
  readDatabase,
  editDatabase,
  createJsonDB,
  getDataByKey,
  deleteDataByKey,
  clearJsonDB,
  postDataByKey,
  patchDataByKey,
  putDataByKey,
};
