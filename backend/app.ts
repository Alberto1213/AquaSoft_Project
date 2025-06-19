import initializeDatabase from './DBconnections'
import app from './routes';
import cors from 'cors';

const PORT = process.env.PORT || 3001;

// Funcția principală pentru pornirea aplicației
const startServer = async () => {
  try {
    await initializeDatabase();
    //importReviewsFromFile();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`GET Request: http://localhost:${PORT}/hotels`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();

export default app;