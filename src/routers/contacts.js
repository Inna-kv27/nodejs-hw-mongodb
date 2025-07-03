import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js'; // Імпортуємо upload middleware

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

// Додаємо upload.single('photo') для обробки завантаження одного файлу з полем 'photo'
contactsRouter.post(
  '/',
  upload.single('photo'), // Обробка файлу
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// Додаємо upload.single('photo') для обробки завантаження одного файлу з полем 'photo'
contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'), // Обробка файлу
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
