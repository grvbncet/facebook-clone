import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const RefreshToken = sequelize.define("RefreshToken", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token: { type: DataTypes.STRING, allowNull: false },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
  },
  expiryDate: { type: DataTypes.DATE, allowNull: false },
});

export default RefreshToken;
