// models/RatingCategory.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../db'

export const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  GlobalPropertyID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { 
      model: 'Hotels', 
      key: 'GlobalPropertyID' 
    } 
  },
  rating: {
    type: DataTypes.DECIMAL(3,1),
    allowNull: true
  }
},
  {
    tableName: 'Rating',
    timestamps: false
  });
