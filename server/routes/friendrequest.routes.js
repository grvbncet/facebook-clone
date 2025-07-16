import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriendRequest,
  getFriendList,
  getReceivedRequest,
  getSentRequest,
  getFriendSuggestions,
} from "../controllers/friendrequest.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send", authenticate, sendFriendRequest);
router.put("/accept/:id", authenticate, acceptFriendRequest);
router.put("/reject/:id", authenticate, rejectFriendRequest);
router.delete("/remove/:id", authenticate, removeFriendRequest);
router.get("/list", authenticate, getFriendList);
router.get("/received-requests", authenticate, getReceivedRequest);
router.get("/sent-requests", authenticate, getSentRequest);
router.get("/suggestions", authenticate, getFriendSuggestions);

export default router;
