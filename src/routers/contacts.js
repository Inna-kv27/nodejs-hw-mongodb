import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

// Імпортуємо middleware для валідації тіла запиту
import validateBody from '../middlewares/validateBody.js';

// Імпортуємо схеми валідації Joi для контактів
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

// Імпортуємо middleware для перевірки валідності ID (буде створений на наступному кроці)
import isValidId from '../middlewares/isValidId.js'; // Буде створено далі

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController)); // Застосовуємо isValidId

// Застосовуємо validateBody з createContactSchema перед контролером створення контакту
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// Застосовуємо isValidId та validateBody з updateContactSchema перед контролером оновлення контакту
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController)); // Застосовуємо isValidId

export default router;
