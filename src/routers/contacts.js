import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController, // ВИПРАВЛЕНО: Імпортуємо updateContactController
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

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
); // ВИПРАВЛЕНО: Використовуємо updateContactController
contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
