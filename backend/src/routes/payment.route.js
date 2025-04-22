import { Router } from "express";
import { capturePayPalOrder, createPayPalOrder } from "../controllers/payment.controller.js";

const router = Router()

router.route("/paypal-create").post(createPayPalOrder)
router.route("/paypal-capture").post(capturePayPalOrder)

export default router