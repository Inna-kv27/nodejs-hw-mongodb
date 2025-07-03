import createHttpError from 'http-errors';
import {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
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

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

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

export const createContactController = async (req, res) => {
  // --- ПОЧАТОК ДЕБАГ-КОДУ ---
  console.log('Received req.body for createContact:', req.body);
  // --- КІНЕЦЬ ДЕБАГ-КОДУ ---

  const userId = req.user._id;
  const photo = req.file; // Отримуємо інформацію про завантажений файл
  const payloadWithUserId = { ...req.body, userId };

  const newContact = await createContact(payloadWithUserId, photo); // Передаємо файл до сервісу

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file; // Отримуємо інформацію про завантажений файл
  const payload = req.body;

  const updatedContact = await updateContact(contactId, userId, payload, photo); // Передаємо файл до сервісу

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
  const userId = req.user._id;

  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
