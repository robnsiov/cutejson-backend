import createRandomString from "../utils/random-string.js";
import User from "../models/user.js";
import defaultData from "../utils/json-db-default.js";
import isObject from "../utils/is-object.js";
import errorMessage from "../utils/error-message.js";
import lodash from "lodash";
import { createUserBackup, updateUserBackup } from "./user-json-backup.js";
import Query from "../utils/query.js";

const createJsonDB = async (req, res) => {
  const randomNumer = createRandomString(36);
  await User.create({ db: randomNumer, json: defaultData });
  await createUserBackup(randomNumer);
  res.status(201).send({ db: randomNumer });
};

const readJsonDB = async (req, res) => {
  const user = req.user;
  res.json(user.json);
};

const editJsonDB = async (req, res) => {
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

const clearJsonDB = async (req, res) => {
  const user = req.user;
  user.json = {};
  await user.save();
  await updateUserBackup(req.params.db, {});
  res.json({});
};

const getKeyOfJsonDB = async (req, res) => {
  const { key } = req.params;
  const user = req.user;
  const data = user.json[key];
  if (Array.isArray(data)) {
    const query = req.query;
    if (!lodash.isEmpty(query)) {
      const parsedQuery = {};
      Object.entries(query).forEach(([key, value]) => {
        parsedQuery[key] = `${value}`.includes(",")
          ? `${value}`.split(",")
          : value;
      });
      const querKey = parsedQuery.query;
      const q = new Query(data, querKey);
      try {
        Object.entries(parsedQuery).forEach(([key, value]) => {
          if (key === "noSelect") {
            if (Array.isArray(value)) q[key](value);
            else q[key]([value]);
          } else {
            if (Array.isArray(value)) q[key](value[0], value[1]);
            else q[key](value);
          }
        });
      } catch (err) {}

      res.json([]);
    } else res.json(data);
  } else {
    if (data == null) res.json(null);
    else res.json(data);
  }
};

const deleteDataByKey = async (req, res) => {
  const user = req.user;
  const json = lodash.cloneDeep(user.json);
  //   await updateUserBackup(req.params.db, json);
  return res.json({});
};

const postDataByKey = async (req, res) => {
  const user = req.user;
  const json = cloneDeep(user.json);
  //   await updateUserBackup(req.params.db, json);
  res.status(201).json({});
};

const patchDataByKey = async (req, res) => {
  const user = req.user;
  const json = cloneDeep(user.json);

  //   await updateUserBackup(req.params.db, json);
  return res.json({});
};
const putDataByKey = async (req, res) => {
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
