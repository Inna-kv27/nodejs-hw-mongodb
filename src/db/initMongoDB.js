import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const url = getEnvVar('MONGODB_URL');

    await mongoose.connect(url);

    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.error('Error connecting to Mongo:', e.message);
    process.exit(1);
  }
};
