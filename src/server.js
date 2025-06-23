import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // <--- НОВИЙ ІМПОРТ: Імпортуємо cookie-parser

import { initMongoConnection } from './db/initMongoDB.js';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import { getEnvVar } from './utils/getEnvVar.js';

dotenv.config();

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cookieParser()); // <--- НОВЕ: Використовуємо cookie-parser для парсингу cookies

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

async function startApp() {
  try {
    await initMongoConnection();
    const app = setupServer();
    const PORT = getEnvVar('PORT');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Open http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
}

startApp();
