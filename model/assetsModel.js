import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Asset = sequelize.define(
  "Assets",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    assetType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "assetcategories",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    currentEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "employees",
        key: "id",
      }
    },
    serialNumber: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    make: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    issuedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "available",
    },
    branch: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { tableName: "assets", timestamps: true }
);

export default Asset;
