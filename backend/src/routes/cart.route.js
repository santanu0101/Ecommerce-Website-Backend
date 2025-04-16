import { Router } from "express";
import {
  addCart,
  clearCart,
  getCart,
  getCartTotal,
  removeCartItems,
  updateCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/")
    .get(verifyJWT, getCart)
    .post(verifyJWT, addCart)
    .delete(verifyJWT, clearCart)

router
  .route("/:itemId")
  .put(verifyJWT, updateCart)
  .delete(verifyJWT, removeCartItems);

router.get("/total",verifyJWT, getCartTotal)



export default router;
