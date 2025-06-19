// models/FacilityType.ts
import { DataTypes } from 'sequelize';
import {sequelize} from '../db';

export const FacilityType = sequelize.define('Facility', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'facility_types',
  timestamps: false
});
