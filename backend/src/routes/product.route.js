import { Router  } from "express";
import { getAllProduct, getProductById, addProduct, updateProducts, deleteProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isSellerCheck } from "../middlewares/isSeller.middleware.js";

const router = Router();

router.route("/")
.get(getAllProduct)
.post(verifyJWT, isSellerCheck, addProduct)

router.route("/:id")
.get(getProductById)
.put(verifyJWT, isSellerCheck, updateProducts)
.delete(verifyJWT, isSellerCheck, deleteProduct)

export default router;