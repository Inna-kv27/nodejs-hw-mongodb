import createHttpError from 'http-errors';

// Імпортуємо всі необхідні функції сервісів.
import {
  listContacts,
  getContactById,
  createContact, // Імпортуємо нову функцію createContact
  updateContact,
  deleteContact,
} from '../services/contacts.js';

/**
 * Контролер для отримання всіх контактів.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const getAllContactsController = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

/**
 * Контролер для отримання контакту за його ID.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

/**
 * Контролер для створення нового контакту.
 * Обробляє POST-запити до /contacts.
 * @param {import('express').Request} req - Об'єкт запиту Express, що містить дані нового контакту в req.body.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const createContactController = async (req, res) => {
  // Дані для створення контакту знаходяться в req.body.
  // Передаємо їх сервісу createContact.
  const newContact = await createContact(req.body);

  // Відправляємо успішну відповідь зі статусом 201 (Created)
  // та даними створеного контакту.
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

/**
 * Контролер для оновлення існуючого контакту (заглушка для Кроку 4).
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

/**
 * Контролер для видалення існуючого контакту (заглушка для Кроку 5).
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
