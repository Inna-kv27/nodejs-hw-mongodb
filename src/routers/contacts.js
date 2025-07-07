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

// Для POST: validateBody ПІСЛЯ контролера (порядок, який працює)
contactsRouter.post(
  '/',
  upload.single('photo'), // Обробка файлу
  ctrlWrapper(createContactController), // Контролер, який перетворює isFavourite
  validateBody(createContactSchema), // Валідація після перетворення
);

// Для PATCH: validateBody ПІСЛЯ контролера (порядок, який працює)
contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'), // Обробка файлу
  ctrlWrapper(updateContactController), // Контролер, який перетворює isFavourite
  validateBody(updateContactSchema), // Валідація після перетворення
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
