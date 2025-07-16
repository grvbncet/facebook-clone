import express from "express";
import { reactToPost, removeReaction } from "../controllers/like.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, reactToPost);
router.delete("/", authenticate, removeReaction);

export default router;
