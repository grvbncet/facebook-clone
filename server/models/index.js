import sequelize from "../config/db.js";
import User from "./User.model.js";
import Post from "./Post.model.js";
import Comment from "./Comment.model.js";
import Like from "./Like.model.js";
import Notification from "./Notification.model.js";
import Friendrequest from "./Friendrequest.model.js";
import RefreshToken from "./RefreshToken.model.js";

// Define associations

// User → Post
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

// User → Comment
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

// User → Notification
User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

// User → Friendrequest
User.hasMany(Friendrequest, {
  foreignKey: "requestSenderId",
  as: "SendRequest",
});
User.hasMany(Friendrequest, {
  foreignKey: "requestReceiverId",
  as: "ReceivedRequest",
});

Friendrequest.belongsTo(User, {
  foreignKey: "requestSenderId",
  as: "sender",
});
Friendrequest.belongsTo(User, {
  foreignKey: "requestReceiverId",
  as: "receiver",
});

// User → Like
User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

// Post → Comment
Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// Post → Like
Post.hasMany(Like, { as: "likes", foreignKey: "postId" });
Like.belongsTo(Post, { foreignKey: "postId" });

// Comment → Notification
Comment.hasOne(Notification, { foreignKey: "commentId" });
Notification.belongsTo(Comment, { foreignKey: "commentId" });

// Like → Notification
Like.hasOne(Notification, { foreignKey: "likeId" });
Notification.belongsTo(Like, { foreignKey: "likeId" });

// Notification → Friendrequest
Notification.hasOne(Friendrequest, { foreignKey: "notificationId" });
Friendrequest.belongsTo(Notification, { foreignKey: "notificationId" });

// User → RefreshToken
User.hasMany(RefreshToken, { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

const db = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  Notification,
  Friendrequest,
  RefreshToken,
};

export default db;
