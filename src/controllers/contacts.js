import createHttpError from 'http-errors';
import mongoose from 'mongoose'; // <-- Додаємо імпорт mongoose для isValidObjectId

// Імпортуємо всі необхідні функції сервісів.
import {
  listContacts,
  getContactById,
  createContact,
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
 * Додано валідацію формату ObjectId.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  // --- НОВА ВАЛІДАЦІЯ ---
  // Перевіряємо, чи є отриманий contactId валідним форматом ObjectId MongoDB.
  if (!mongoose.isValidObjectId(contactId)) {
    // Якщо ID невалідний, викидаємо помилку 400 Bad Request.
    // Цю помилку перехопить ctrlWrapper, а потім errorHandler.
    throw createHttpError(400, 'Invalid contact ID format');
  }
  // --- КІНЕЦЬ НОВОЇ ВАЛІДАЦІЇ ---

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
  const newContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

/**
 * Контролер для оновлення існуючого контакту.
 * Додано валідацію формату ObjectId.
 * @param {import('express').Request} req - Об'єкт запиту Express, що містить ID контакту в req.params
 * та часткові дані для оновлення в req.body.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const payload = req.body;

  // --- НОВА ВАЛІДАЦІЯ ---
  // Перевіряємо, чи є отриманий contactId валідним форматом ObjectId MongoDB.
  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }
  // --- КІНЕЦЬ НОВОЇ ВАЛІДАЦІЇ ---

  const updatedContact = await updateContact(contactId, payload);

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
 * Контролер для видалення існуючого контакту.
 * Додано валідацію формату ObjectId.
 * @param {import('express').Request} req - Об'єкт запиту Express, що містить ID контакту в req.params.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  // --- НОВА ВАЛІДАЦІЯ ---
  // Перевіряємо, чи є отриманий contactId валідним форматом ObjectId MongoDB.
  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }
  // --- КІНЕЦЬ НОВОЇ ВАЛІДАЦІЇ ---

  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
