import { DataTypes } from 'sequelize';
import { sequelize } from '../db'

export const HotelRatingCategory = sequelize.define('HotelRatingCategory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    GlobalPropertyID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false
    }
},
    {
        tableName: 'HotelRatingCategories',
        timestamps: false
    }
);
