import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" }, // IMPORTANT: Sequelize default table name is plural
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Posts", key: "id" }, // IMPORTANT: Sequelize default table name is plural
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Content is required" } },
    },
  },
  { timestamps: true }
);

export default Comment;
