import express from "express";
import {
  createPost,
  deletePost,
  getFeedPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", authenticate, upload.single("image"), createPost);
router.get("/", authenticate, getFeedPosts);
router.delete("/", authenticate, deletePost);
router.patch("/", authenticate, upload.single("image"), updatePost);

export default router;
