import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
const Like = sequelize.define(
  "Like",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Posts", key: "id" },
    },
    reaction: {
      type: DataTypes.ENUM("Like", "Love", "Laugh", "Wow", "Sad", "Angry"),
      allowNull: false,
    },
  },
  { timestamps: true }
);
export default Like;
