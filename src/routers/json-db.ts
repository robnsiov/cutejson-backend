import express from "express";
import {
  editJsonDB,
  readJsonDB,
  createJsonDB,
  getKeyOfJsonDB,
  deleteDataByKey,
  clearJsonDB,
  postDataByKey,
  patchDataByKey,
  putDataByKey,
} from "../controllers/json-db";
import DBIsExist from "../middlewares/db-is-exist";
import asyncHandler from "../utils/async-handler";

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
  asyncHandler(deleteDataByKey)
);
jsonDBRouter.post(
  "/:db/:key",
  asyncHandler(DBIsExist),
  asyncHandler(postDataByKey)
);
jsonDBRouter.patch(
  "/:db/:key",
  asyncHandler(DBIsExist),
  asyncHandler(patchDataByKey)
);
jsonDBRouter.put(
  "/:db/:key",
  asyncHandler(DBIsExist),
  asyncHandler(putDataByKey)
);

export default jsonDBRouter;
