import sequalize from "../config/db.js";
import Asset from "./assetsModel.js";
import AssetCategory from "./assetCategoryModel.js";
import AssetHistory from "./assetHistory.js";
import Employee from "./employeeModel.js";
Asset.belongsTo(AssetCategory, {
  foreignKey: 'assetType',
  as: 'category'
});

AssetCategory.hasMany(Asset, {
  foreignKey: 'assetType',
  as: 'assets'
});

AssetHistory.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
AssetHistory.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

Asset.hasMany(AssetHistory, { foreignKey: 'assetId', as: 'history' });
Asset.belongsTo(Employee, { foreignKey: 'currentEmployeeId', as: 'currentEmployee' });

Employee.hasMany(Asset, { foreignKey: 'currentEmployeeId', as: 'issuedAssets' });
Employee.hasMany(AssetHistory, { foreignKey: 'employeeId', as: 'assetHistory' });

export { sequalize, Asset, AssetCategory,AssetHistory,Employee };