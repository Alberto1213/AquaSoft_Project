import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('hotels', 'postgres', 'alberto12', {
  host: 'localhost',
  port: 5432,       
  dialect: 'postgres',
  logging: console.log,
});