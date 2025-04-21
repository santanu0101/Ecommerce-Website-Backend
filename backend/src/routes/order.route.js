import { Router } from "express"
import { createOrder, deleteOrder, getOrder, getOrderById, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isSellerCheck } from "../middlewares/isSeller.middleware.js";


const router = Router();

router.route("/")
    .post(verifyJWT,createOrder)
    .get(verifyJWT, getOrder)

router.route("/:id")
    .get(verifyJWT, getOrderById)
    .put(verifyJWT, isSellerCheck, updateOrderStatus)
    .delete(verifyJWT, isSellerCheck, deleteOrder)

export default router