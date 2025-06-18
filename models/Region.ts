import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

export const Region = sequelize.define('Region', {
  PropertyStateProvinceID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    allowNull: false 
  },
  PropertyStateProvinceName: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  }
}, {
  tableName: 'Regions',
  timestamps: false
});