// models/RatingCategory.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../db'

export const RatingCategory = sequelize.define('RatingCategory', {
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
},
  {
    tableName: 'RatingCategories',
    timestamps: false
  });
