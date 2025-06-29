import createHttpError from 'http-errors';

import {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

/**
 * Контролер для отримання всіх контактів з пагінацією, сортуванням та фільтрацією,
 * належних поточному автентифікованому користувачеві.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const getAllContactsController = async (req, res) => {
  // Отримуємо userId з об'єкта req.user, який був доданий authenticate middleware
  const userId = req.user._id;

  const page = parseInt(req.query.page || '1', 10);
  const perPage = parseInt(req.query.perPage || '10', 10);
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';
  const type = req.query.type;
  let isFavourite = undefined;
  if (req.query.isFavourite !== undefined) {
    isFavourite = req.query.isFavourite === 'true';
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw createHttpError(400, 'Invalid sortOrder. Must be "asc" or "desc".');
  }

  // Передаємо userId та інші параметри до сервісної функції
  const paginatedContacts = await listContacts(userId, {
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: paginatedContacts.data,
      page: paginatedContacts.page,
      perPage: paginatedContacts.perPage,
      totalItems: paginatedContacts.totalItems,
      totalPages: paginatedContacts.totalPages,
      hasPreviousPage: paginatedContacts.hasPreviousPage,
      hasNextPage: paginatedContacts.hasNextPage,
    },
  });
};

/**
 * Контролер для отримання контакту за ID, належного поточному користувачеві.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  // Отримуємо userId з об'єкта req.user
  const userId = req.user._id;

  // Передаємо userId до сервісної функції
  const contact = await getContactById(contactId, userId);

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
 * Контролер для створення нового контакту для поточного користувача.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const createContactController = async (req, res) => {
  // Отримуємо userId з об'єкта req.user
  const userId = req.user._id;
  // Додаємо userId до тіла запиту перед передачею до сервісу
  const payloadWithUserId = { ...req.body, userId };

  const newContact = await createContact(payloadWithUserId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

/**
 * Контролер для оновлення існуючого контакту, належного поточному користувачеві.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  // Отримуємо userId з об'єкта req.user
  const userId = req.user._id;
  const payload = req.body;

  // Передаємо userId до сервісної функції
  const updatedContact = await updateContact(contactId, userId, payload);

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
 * Контролер для видалення контакту, належного поточному користувачеві.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  // Отримуємо userId з об'єкта req.user
  const userId = req.user._id;

  // Передаємо userId до сервісної функції
  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
