import { Request, Response } from "express";
import createRandomString from "../utils/random-string";
import User from "../models/user";
import defaultData from "../utils/json-db-default";
import isObject from "../utils/is-object";
import errorMessage from "../utils/error-message";
import { cloneDeep, isEmpty } from "lodash";
import { createUserBackup, updateUserBackup } from "./user-json-backup";
import Query from "../utils/query";

const createJsonDB = async (req: Request, res: Response) => {
  const randomNumer = createRandomString(36);
  await User.create({ db: randomNumer, json: defaultData });
  await createUserBackup(randomNumer);
  res.status(201).send({ db: randomNumer });
};

const readJsonDB = async (req: Request, res: Response) => {
  const user = req.user;
  res.json(user.json);
};

const editJsonDB = async (req: Request, res: Response) => {
  const body = req.body;
  if (!isObject(body))
    return res
      .status(400)
      .send(errorMessage("Send an object not another data types."));

  const user = req.user;
  user.json = req.body;
  await user.save();

  await updateUserBackup(req.params.db, body);
  res.json(body);
};

const clearJsonDB = async (req: Request, res: Response) => {
  const user = req.user;
  user.json = {};
  await user.save();
  await updateUserBackup(req.params.db, {});
  res.json({});
};

const getKeyOfJsonDB = async (req: Request, res: Response) => {
  const { key } = req.params;
  const user = req.user;
  const data = user.json[key];
  if (Array.isArray(data)) {
    const query = req.query;
    if (!isEmpty(query)) {
      const parsedQuery: any = {};
      Object.entries(query).forEach(([key, value]) => {
        parsedQuery[key] = `${value}`.includes(",")
          ? `${value}`.split(",")
          : value;
      });
      // const querKey = parsedQuery.query;
      // const q: any = new Query(data, querKey);
      // try {
      //   Object.entries(parsedQuery).forEach(([key, value]) => {
      //     if (key === "noSelect") {
      //       if (Array.isArray(value)) q[key](value);
      //       else q[key]([value]);
      //     } else {
      //       if (Array.isArray(value)) q[key](value[0], value[1]);
      //       else q[key](value);
      //     }
      //   });
      // } catch (err) {}

      res.json([]);
    } else res.json(data);
  } else {
    if (data == null) res.json(null);
    else res.json(data);
  }
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
  readJsonDB,
  editJsonDB,
  createJsonDB,
  getKeyOfJsonDB,
  deleteDataByKey,
  clearJsonDB,
  postDataByKey,
  patchDataByKey,
  putDataByKey,
};
