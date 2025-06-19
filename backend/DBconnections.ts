import { sequelize } from './db';
import { setupAssociations} from './models/associations';

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    setupAssociations();
    console.log('Model associations established');
    
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synchronized - tables created/updated');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default initializeDatabase;
