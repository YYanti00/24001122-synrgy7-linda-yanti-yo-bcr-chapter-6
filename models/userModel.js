import { DataTypes } from "sequelize";
import dbSequelize from "../config/database.js";

const userModel = dbSequelize.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("superadmin", "admin", "user"),
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default userModel;
