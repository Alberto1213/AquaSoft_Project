// models/HotelFacility.ts
import { DataTypes } from 'sequelize';
import {sequelize} from '../db';


export const HotelFacility = sequelize.define('HotelFacility', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  GlobalPropertyID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'hotel_facilities',
  timestamps: false
});
