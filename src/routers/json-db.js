import express from "express";
import {
  editJsonDB,
  readJsonDB,
  createJsonDB,
  getKeyOfJsonDB,
  deleteKeyOfJsonDB,
  clearJsonDB,
  postKeyOfJsonDB,
  putKeyOfJsonDB,
} from "../controllers/json-db.js";
import DBIsExist from "../middlewares/db-is-exist.js";
import asyncHandler from "../utils/async-handler.js";

const jsonDBRouter = express.Router();

jsonDBRouter.post("/", asyncHandler(createJsonDB));
jsonDBRouter.put("/:db", asyncHandler(DBIsExist), asyncHandler(editJsonDB));
jsonDBRouter.get("/:db", asyncHandler(DBIsExist), asyncHandler(readJsonDB));
jsonDBRouter.delete("/:db", asyncHandler(DBIsExist), asyncHandler(clearJsonDB));
jsonDBRouter.get(
  "/:db/:key",
  asyncHandler(DBIsExist),
  asyncHandler(getKeyOfJsonDB)
);
jsonDBRouter.delete(
  "/:db/:key",
  asyncHandler(DBIsExist),
  asyncHandler(deleteKeyOfJsonDB)
);
jsonDBRouter.post(
  "/:db/:key",
  asyncHandler(DBIsExist),
  asyncHandler(postKeyOfJsonDB)
);

jsonDBRouter.put(
  "/:db/:key",
  asyncHandler(DBIsExist),
  asyncHandler(putKeyOfJsonDB)
);

export default jsonDBRouter;
