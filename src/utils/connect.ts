import mongoose from 'mongoose';
import logger from './logger';

async function connect() {
  //console.log('Connecting',process.env.DB_URI);
  const dbUri = process.env.DB_URI;

  try {
    await mongoose.connect(dbUri);
    logger.info('Connected to DB');
  } catch (error) {
    logger.error('Could not connect to db');
    process.exit(1);
  }
}

export default connect;
