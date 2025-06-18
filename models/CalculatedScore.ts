// models/RatingCategory.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../db'

export const CalculatedScore = sequelize.define('CalculatedScore', {
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
  score: {
    type: DataTypes.DECIMAL(3,2),
    allowNull: true
  }
},
  {
    tableName: 'CalculatedScore',
    timestamps: false
  });
