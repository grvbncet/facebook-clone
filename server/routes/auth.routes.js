import express from "express";
import {
  createUser,
  getUserProfile,
  login,
  logout,
  refreshToken,
  updateProfile,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

router.get("/profile", authenticate, getUserProfile);
router.patch("/profile/update", authenticate, updateProfile);

export default router;
