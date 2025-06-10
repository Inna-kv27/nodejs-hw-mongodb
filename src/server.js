import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js'; // << ОНОВІТЬ ЦЕЙ ІМПОРТ

dotenv.config();

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  });
  // **********************************

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = getEnvVar('PORT');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
