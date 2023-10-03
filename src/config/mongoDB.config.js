import mongoose from 'mongoose';
import { bronxLogger } from '../utils/logger.js';

export default async function configureMongo() {
  try {
    const mongo = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
    await mongoose.connect(mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    bronxLogger('info', `MongoDB connection successful to ${process.env.DB_NAME} database`);
  } catch (err) {
    bronxLogger('error', `Cannot connect to MongoDB ${process.env.DB_NAME} database - ${err}`);
  }
}