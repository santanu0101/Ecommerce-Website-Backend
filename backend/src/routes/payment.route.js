import { Router } from "express";
import { createPayment } from "../controllers/payment.controller.js";

const router = Router()

router.route("/").post(createPayment)

export default router