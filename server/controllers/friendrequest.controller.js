import { Op, Sequelize } from "sequelize";
import db from "../models/index.js";
import { StatusCodes } from "../utils/statusCodes.js";
import User from "../models/User.model.js";

const Friendrequest = db.Friendrequest;

// Function to send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    console.log("sendFriendRequest triggered", req);

    const { requestReceiverId } = req.body;
    const requestSenderId = req.user.id; // Authenticated user

    if (requestSenderId === requestReceiverId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }
    // Check if request already exists
    const existingRequest = await Friendrequest.findOne({
      where: {
        requestSenderId,
        requestReceiverId,
      },
    });

    if (existingRequest) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Friend request already sent",
      });
    }

    const friendRequest = await Friendrequest.create({
      requestSenderId,
      requestReceiverId,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Friend request sent successfully",
      data: friendRequest,
    });
  } catch (error) {
    console.error("Error in sending friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to send friend request" });
  }
};

// Function to accept or reject a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const result = await Friendrequest.update(
      {
        status: "accepted",
      },
      {
        where: {
          requestSenderId: req.params.id,
          requestReceiverId: req.user.id,
          status: "pending",
        },
      }
    );

    if (result[0] === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No pending friend request found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error("Error in accepting friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to accept friend request" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const result = await Friendrequest.update(
      {
        status: "rejected",
      },
      {
        where: {
          requestSenderId: req.params.id,
          requestReceiverId: req.user.id,
          status: "pending",
        },
      }
    );

    if (result[0] === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No pending friend request found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    console.error("Error in accepting friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to accept friend request" });
  }
};

export const removeFriendRequest = async (req, res) => {
  try {
    const result = await Friendrequest.destroy({
      where: {
        requestSenderId: req.params.id,
        requestReceiverId: req.user.id,
      },
    });
    if (result === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Friend request not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Friend request removed successfully",
    });
  } catch (error) {
    console.error("Error in accepting friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to accept friend request" });
  }
};

export const getSentRequest = async (req, res) => {
  try {
    const sendRequests = await Friendrequest.findAll({
      where: {
        requestSenderId: req.user.id,
        status: "pending",
      },
      include: {
        model: db.User,
        as: "receiver",
        attributes: ["id", "name", "email"],
      },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      sendRequests,
    });
  } catch (error) {
    console.error("Error in accepting friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to accept friend request" });
  }
};

export const getReceivedRequest = async (req, res) => {
  try {
    const receivedRequest = await Friendrequest.findAll({
      where: {
        requestReceiverId: req.user.id,
        status: "pending",
      },
      include: {
        model: db.User,
        as: "sender",
        attributes: ["id", "name", "email"],
      },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      receivedRequest,
    });
  } catch (error) {
    console.error("Error in accepting friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to accept friend request" });
  }
};

export const getFriendList = async (req, res) => {
  try {
    const friends = await Friendrequest.findAll({
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

    // Extract and normalize friend data
    const friendsList = friends.map((friend) => {
      const isSender = friend.requestSenderId === req.user.id;
      return isSender ? friend.receiver : friend.sender;
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      friendsList,
    });
  } catch (error) {
    console.error("Error in accepting friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to accept friend request" });
  }
};

export const getFriendSuggestions = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    // Get all user IDs that current user has already interacted with (friends or requests)

    const request = await Friendrequest.findAll({
      where: {
        [Op.or]: [
          { requestSenderId: currentUserId },
          { requestReceiverId: currentUserId },
        ],
      },
    });

    // Collect all user IDs to exclude (already friends or pending)
    const excludedUserIds = new Set([currentUserId]);

    request.forEach((r) => {
      excludedUserIds.add(r.requestSenderId);
      excludedUserIds.add(r.requestReceiverId);
    });

    // Get all user IDs that current user has not interacted with
    const suggestedUsers = await db.User.findAll({
      where: {
        id: {
          [Op.notIn]: Array.from(excludedUserIds),
        },
      },
      attributes: ["id", "name"],
      limit: 5,
      order: Sequelize.literal("RAND()"),
    });

    const friendships = await Friendrequest.findAll({
      where: {
        status: "accepted",
        [Op.or]: [
          { requestSenderId: currentUserId },
          { requestReceiverId: currentUserId },
        ],
      },
    });

    const friendIds = friendships.map((f) =>
      f.requestSenderId === currentUserId
        ? f.requestReceiverId
        : f.requestSenderId
    );

    const mutuals = await Friendrequest.findAll({
      where: {
        status: "accepted",
        [Op.or]: [
          { requestSenderId: { [Op.in]: friendIds } },
          { requestReceiverId: { [Op.in]: friendIds } },
        ],
      },
    });

    const mutualFriendIds = mutuals
      .map((f) => {
        if (
          friendIds.includes(f.requestSenderId) &&
          f.requestReceiverId !== currentUserId
        )
          return f.requestReceiverId;
        if (
          friendIds.includes(f.requestReceiverId) &&
          f.requestSenderId !== currentUserId
        )
          return f.requestSenderId;
        return null;
      })
      .filter(Boolean)
      .filter((id) => !friendIds.includes(id) && id !== currentUserId); // Exclude existing friends and self

    const mutualCounts = {};
    mutualFriendIds.forEach((id) => {
      mutualCounts[id] = (mutualCounts[id] || 0) + 1;
    });

    const suggestedMutualUsers = await User.findAll({
      where: {
        id: {
          [Op.in]: Object.keys(mutualCounts),
        },
      },
      attributes: ["id", "name"],
      limit: 5,
      order: Sequelize.literal("RAND()"),
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      suggestedMutualUsers,
      suggestedUsers,
    });
  } catch (error) {
    console.error("Error in suggest friend request:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to suggest friend request" });
  }
};
