import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController, // Переконайтесь, що цей імпорт присутній
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', ctrlWrapper(updateContactController));

// Маршрут для видалення існуючого контакту: DELETE /contacts/:contactId
// Він вже був доданий як заглушка на Кроці 1, тепер контролер реалізований.
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
