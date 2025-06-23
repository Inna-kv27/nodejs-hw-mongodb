import express from 'express';
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

import authenticate from '../middlewares/authenticate.js'; // <--- НОВИЙ ІМПОРТ: Імпортуємо authenticate

const router = express.Router();

// Застосовуємо authenticate middleware до всіх роутів контактів.
// Він повинен стояти перед isValidId та validateBody.
router.use(authenticate); // <--- ЗАСТОСУВАННЯ: Це застосує authenticate до ВСІХ маршрутів у цьому роутері.

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
