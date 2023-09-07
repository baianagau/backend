import mongoose from 'mongoose';
import { bronxLogger } from '../utils/logger.js';

export default function configureMongo() {
  const logger = bronxLogger();
  const mongo = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
  mongoose.connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
      bronxLogger('info', `MongoDB connection successful to ${process.env.DB_NAME} database`);
  })
  .catch(err => {
      bronxLogger('error', `Cannot connect to MongoDB ${process.env.DB_NAME} database - ${err}`);        
  });

}