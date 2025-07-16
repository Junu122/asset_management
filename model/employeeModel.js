import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Employee=sequelize.define('Employee',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    position:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
},{
    tableName: 'employees',
  timestamps: true
})

export default Employee;