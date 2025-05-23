import express from "express";
import { signup, login, logout, updateProfile, checkAuth, verifyOTP } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();



router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/verify-otp", verifyOTP)

router.put("/update-profile", protectRoute, updateProfile)

router.get("/check-auth", protectRoute, checkAuth)

export default router;
