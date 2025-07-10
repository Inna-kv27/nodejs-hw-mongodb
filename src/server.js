import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

// Імпорти для Swagger UI
import swaggerUi from 'swagger-ui-express';
// ПОВЕРНУТО до createRequire/require() для обходу ERR_IMPORT_ATTRIBUTE_MISSING
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('../docs/swagger.json');

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
  app.use(cookieParser());

  // ДОДАНО: Перенаправлення з кореневого шляху на документацію Swagger UI
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // НОВИЙ РОУТ ДЛЯ SWAGGER UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
