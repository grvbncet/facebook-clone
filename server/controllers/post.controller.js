import Friendrequest from "../models/Friendrequest.model.js";
import db from "../models/index.js";
import Like from "../models/Like.model.js";
import { StatusCodes } from "../utils/statusCodes.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs"; // If you're using ES Modules

const Post = db.Post;
const User = db.User;

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Text content is required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const createdPost = await Post.create({ userId, content, imageUrl });
    // Refetch with user details
    const post = await Post.findByPk(createdPost.id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    return res.status(StatusCodes.CREATED).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to create post" });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const friendList = await Friendrequest.findAll({
      where: {
        status: "accepted",
        [Op.or]: [
          { requestSenderId: req.user.id },
          { requestReceiverId: req.user.id },
        ],
      },
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "name", "email"],
        },
        {
          model: db.User,
          as: "receiver",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const friendIds = friendList.map((friend) => {
      if (friend.requestSenderId === req.user.id) {
        return friend.receiver.id;
      } else {
        return friend.sender.id;
      }
    });

    const feedIds = [...friendIds, req.user.id];

    // Fetch posts from the database
    const posts = await Post.findAll({
      where: { userId: { [Op.in]: feedIds } },
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        {
          model: Like,
          as: "likes",
          attributes: ["userId", "reaction"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Map over posts to format response
    const postWithReactions = posts.map((post) => {
      // Aggregate total reactions
      const reactionCount = {};
      post.likes.forEach((like) => {
        reactionCount[like.reaction] = (reactionCount[like.reaction] || 0) + 1;
      });

      // Get the current user's reaction

      const userReaction = post.likes.find(
        (like) => like.userId === req.user.id
      );

      return {
        ...post.toJSON(),
        reactionCount,
        currentUserReaction: userReaction?.reaction || null,
      };
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, posts: postWithReactions });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch posts" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.body.id;
    const userId = req.user.id;
    await Post.destroy({ where: { id: postId, userId } });

    return res
      .status(200)
      .json({ success: true, deletedPost: postId, message: "Post deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId, content, removeImage } = req.body;
    const userId = req.user.id;

    if (!postId) {
      return res
        .status(400)
        .json({ success: false, message: "postId is required" });
    }

    // Find post and validate ownership

    const post = await Post.findOne({
      where: { id: postId, userId },
      include: [
        {
          model: User,
          attributes: ["id", "name"], // include only what you need
        },
      ],
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Update content
    if (content !== undefined) post.content = content;

    // If removeImage flag is true, remove image (you decide how)

    if (removeImage === "true" && post.imageUrl) {
      const filename = path.basename(post.imageUrl); // Extracts: '1752664894481-download.jpeg'
      const filePath = path.join("uploads", filename); // uploads/1752664894481-download.jpeg

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", filePath);
        }
      });

      post.imageUrl = null;
    }

    // If a new image is uploaded, update imageUrl with filename
    if (req.file !== undefined) {
      post.imageUrl = `/uploads/${req.file.filename}`;
    }
    await post.save();
    return res
      .status(200)
      .json({ success: true, updatedPost: post, message: "Post updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update post" });
  }
};
