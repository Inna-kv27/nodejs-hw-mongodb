import createHttpError from 'http-errors';
import mongoose from 'mongoose';

// Імпортуємо всі необхідні функції сервісів.
import {
  listContacts, // listContacts тепер обробляє пагінацію
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

/**
 * Контролер для отримання всіх контактів з пагінацією.
 * @param {import('express').Request} req - Об'єкт запиту Express, що може містити query параметри page та perPage.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const getAllContactsController = async (req, res) => {
  // Отримуємо query параметри page та perPage з req.query.
  // Перетворюємо їх на числа. Якщо вони відсутні або невалідні, використовуємо значення за замовчуванням (1 та 10).
  const page = parseInt(req.query.page || '1', 10);
  const perPage = parseInt(req.query.perPage || '10', 10);

  // Викликаємо сервіс listContacts, передаючи йому параметри пагінації.
  const paginatedContacts = await listContacts({ page, perPage });

  // Відправляємо успішну відповідь у новому форматі.
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: paginatedContacts.data, // Масив контактів поточної сторінки
      page: paginatedContacts.page, // Номер поточної сторінки
      perPage: paginatedContacts.perPage, // Кількість елементів на сторінці
      totalItems: paginatedContacts.totalItems, // Загальна кількість елементів
      totalPages: paginatedContacts.totalPages, // Загальна кількість сторінок
      hasPreviousPage: paginatedContacts.hasPreviousPage, // Чи є попередня сторінка
      hasNextPage: paginatedContacts.hasNextPage, // Чи є наступна сторінка
    },
  });
};

// *****************************************************************
// Решта контролерів (getContactByIdController, createContactController,
// updateContactController, deleteContactController) залишаються без змін.
// Я їх тут не повторюю, щоб не захаращувати код, але вони мають бути у вашому файлі.
// *****************************************************************

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

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

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const payload = req.body;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

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

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
