import express from "express";
import { registerUser, loginUser, updateUserProfile, getUserProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", authMiddleware, upload.single("avatar"), updateUserProfile); // route protégée
router.get("/profile", authMiddleware, getUserProfile); // ✅ nouvelle route GET

export default router;
