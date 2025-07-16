import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AssetCategory = sequelize.define('AssetCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'assetcategories',
    timestamps: true
});

export default AssetCategory;