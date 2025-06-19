import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

export const Manager = sequelize.define('Manager', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idhotel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    iduser: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tableName: 'managers',
    timestamps: false,
});
