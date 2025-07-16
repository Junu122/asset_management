import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const AssetHistory=sequelize.define('AssetHistory',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assets',
      key: 'id'
    }
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null for purchase/scrap events
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.ENUM('PURCHASE', 'ISSUE', 'RETURN', 'SCRAP'),
    allowNull: false
  },
  actionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
  
},
 {
  tableName: 'assethistories',
  timestamps: true
}
)

export default AssetHistory;