import { Router } from "express";
import {
  createCatagory,
  deleteCatagory,
  getCatagory,
  updateCatagory,
} from "../controllers/catagories.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isSellerCheck } from "../middlewares/isSeller.middleware.js";

const router = Router();

router
  .route("/")
  .get(getCatagory)
  .post(verifyJWT, isSellerCheck, createCatagory);

router
  .route("/:id")
  .put(verifyJWT, isSellerCheck, updateCatagory)
  .delete(verifyJWT, isSellerCheck, deleteCatagory);

export default router;
