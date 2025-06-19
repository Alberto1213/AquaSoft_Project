import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

export const Review = sequelize.define('Review', {
  ReviewID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    allowNull: false, 
    autoIncrement: true
  },
  GlobalPropertyID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { 
      model: 'Hotels', 
      key: 'GlobalPropertyID' 
    } 
  },
  Title: { 
    type: DataTypes.STRING(255), 
    allowNull: true, 
  },
  Rating: { 
    type: DataTypes.DECIMAL(3, 1), 
    allowNull: true 
  },
  TravelDate: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  PositiveFeedback: {
    type :DataTypes.TEXT,
    allowNull: true 
  },
  NegativeFeedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  NumberOfNights: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  RoomType: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'Reviews',
  timestamps: false
});