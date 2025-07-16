import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Friendrequest = sequelize.define(
  "Friendrequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // One user requests the friendship (requesterId)
    requestSenderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },

    // The other user receives the friendship request (receiverId)
    requestReceiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Notifications",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  { timestamps: true }
);

export default Friendrequest;
