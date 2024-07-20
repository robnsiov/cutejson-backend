import createRandomString from "../utils/random-string.js";
import User from "../models/user.js";
import isObject from "../utils/is-object.js";
import errorMessage from "../utils/error-message.js";
import lodash from "lodash";
import { createUserBackup, updateUserBackup } from "./user-json-backup.js";
import filterByQuery from "../utils/filter-by-query.js";
import { deleteProperty } from "dot-prop";
import ERROR_MESSAGES from "../../constants/errors.js";
import { DEFAULT_JSON_DB } from "../../constants/index.js";

const createJsonDB = async (req, res) => {
  const randomNumer = createRandomString(36);
  await User.create({ db: randomNumer, json: DEFAULT_JSON_DB });
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
    return res.status(400).send(errorMessage(ERROR_MESSAGES.ONLY_OBJECT));

  const user = req.user;
  user.json = req.body;
  await user.save();

  await updateUserBackup(req.params.db, body);
  res.status(201).json(body);
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
  const queryStatus = filterByQuery(data, req.query);
  if (queryStatus.status === "return data") res.json(data);
  else if (queryStatus.status === "return filtered")
    res.json(queryStatus.filtered);
  else if (queryStatus.status === "return null") res.json(null);
  else if (queryStatus.status === "return error")
    res.status(400).json(errorMessage(queryStatus.error));
};

const deleteKeyOfJsonDB = async (req, res) => {
  const user = req.user;
  const { key } = req.params;
  const json = lodash.cloneDeep(user.json);

  const removeKey = async () => {
    // remove from start
    // json = { users: [] }
    // after delete=> json = {}
    const removed = { [key]: lodash.cloneDeep(json[key]) };
    deleteProperty(json, key);
    user.json = json;
    await user.save();
    await updateUserBackup(req.params.db, json);
    res.json(removed);
  };

  if (key in json) {
    if (Array.isArray(json[key])) {
      if (lodash.isEmpty(req.query)) {
        await removeKey();
      } else {
        const queryStatus = filterByQuery(json[key], req.query);
        if (queryStatus.status === "return data") {
          res.json(null);
        } else if (queryStatus.status === "return filtered") {
          const removed = [];
          json[key].forEach((data, i) => {
            queryStatus.filtered.forEach((f) => {
              if (JSON.stringify(f) === JSON.stringify(data)) {
                removed.push(lodash.cloneDeep(json[key][i]));
                json[key].splice(i, 1);
              }
            });
          });
          user.json = json;
          await user.save();
          await updateUserBackup(req.params.db, json);
          res.json(removed.length === 0 ? null : removed);
        } else if (queryStatus.status === "return null") {
          // nothing for remove
          res.json(null);
        } else if (queryStatus.status === "return error")
          res.status(400).json(errorMessage(queryStatus.error));
      }
    } else {
      await removeKey();
    }
  } else {
    res.status(404).json(errorMessage(`${key} key is not in your DB!`));
  }
};

const postKeyOfJsonDB = async (req, res) => {
  const user = req.user;
  const json = lodash.cloneDeep(user.json);
  const { key } = req.params;
  if (req.query.replace === "true") {
    json[key] = req.body;
  } else {
    if (Array.isArray(json[key])) {
      json[key].push(req.body);
    } else json[key] = req.body;
  }
  user.json = json;
  await user.save();
  await updateUserBackup(req.params.db, json);
  res.status(201).json(json);
  // if key was undifiend => create a key with data
  // if body was aaray => push data in body
  // if replace=true => put data in value of key
};

const putKeyOfJsonDB = async (req, res) => {
  const user = req.user;
  const { key } = req.params;

  const json = lodash.cloneDeep(user.json);

  const updateKey = async () => {
    user.json = json;
    await user.save();
    await updateUserBackup(req.params.db, json);
    res.status(201).json(json);
  };

  if (key in json) {
    if (Array.isArray(json[key])) {
      if (lodash.isEmpty(req.query)) {
        await updateKey();
      } else {
        const queryStatus = filterByQuery(json[key], req.query);
        if (queryStatus.status === "return data") {
          res.status(201).json(json);
        } else if (queryStatus.status === "return filtered") {
          json[key].forEach((data, i) => {
            queryStatus.filtered.forEach((f) => {
              if (JSON.stringify(f) === JSON.stringify(data)) {
                json[key][i] = req.body;
              }
            });
          });
          await updateKey();
        } else if (queryStatus.status === "return null") {
          // nothing for update
          res.status(201).json(json);
        } else if (queryStatus.status === "return error")
          res.status(400).json(errorMessage(queryStatus.error));
      }
    } else {
      await updateKey();
    }
  } else {
    res.status(404).json(errorMessage(`${key} key is not in your DB!`));
  }
};

export {
  readJsonDB,
  editJsonDB,
  createJsonDB,
  getKeyOfJsonDB,
  deleteKeyOfJsonDB,
  clearJsonDB,
  postKeyOfJsonDB,
  putKeyOfJsonDB,
};
