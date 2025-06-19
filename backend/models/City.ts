import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

export const City = sequelize.define('City', {
  CityID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    allowNull: false 
  },
  CityName: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  Country: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  }
}, {
  tableName: 'Cities',
  timestamps: false
});