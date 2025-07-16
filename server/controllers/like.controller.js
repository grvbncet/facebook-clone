import db from "../models/index.js";
import { StatusCodes } from "../utils/statusCodes.js";

const Like = db.Like;
const Post = db.Post;
const User = db.User;

export const reactToPost = async (req, res) => {
  const { postId, reaction } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Like.findOne({ where: { postId, userId } });

    if (existing) {
      if (existing.reaction === reaction) {
        // Same reaction again = remove it
        await existing.destroy();
        return res.json({ removed: true });
      } else {
        // Update to new reaction
        existing.reaction = reaction;
        await existing.save();
        return res.json({ updated: true, reaction });
      }
    } else {
      // Create new reaction
      await Like.create({ postId, userId, reaction });
      return res.json({ created: true, reaction });
    }
  } catch (error) {
    console.error("Reaction failed:", error);
    return res.status(500).json({ error: "Reaction failed" });
  }
};

export const removeReaction = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Like.findOne({ where: { postId, userId } });

    if (existing) {
      await existing.destroy();
      return res.json({ removed: true });
    } else {
      return res.json({ removed: false });
    }
  } catch (error) {
    console.error("Reaction failed:", error);
    return res.status(500).json({ error: "Reaction failed" });
  }
};
