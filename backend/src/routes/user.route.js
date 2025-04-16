import { Router } from "express";
import { userLogin, userRegister, userLogout, changePassword, changeProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", userRegister)
router.post("/login", userLogin)

// secure route
router.post("/logout",verifyJWT, userLogout)
router.post("/change-password",verifyJWT, changePassword)
router.post("/change-profile", verifyJWT, changeProfile)

export default router;
