import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Post = sequelize.define(
  "Post",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" }, // IMPORTANT: Sequelize default table name is plural
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Content is required" } },
    },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: true }
);

export default Post;
