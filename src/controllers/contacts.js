import createHttpError from 'http-errors';
// Mongoose import is not needed here as ObjectId validation is handled by middleware
// import mongoose from 'mongoose';

// Import all necessary service functions.
import {
  listContacts, // listContacts now handles filtering
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

/**
 * Controller for retrieving all contacts with pagination, sorting, and filtering.
 * @param {import('express').Request} req - Express request object, which may contain query parameters.
 * @param {import('express').Response} res - Express response object.
 */
export const getAllContactsController = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const perPage = parseInt(req.query.perPage || '10', 10);

  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';

  // --- NEW: Retrieve filtering query parameters ---
  const type = req.query.type; // Get contactType from query
  // For boolean isFavourite, convert string to boolean. 'true' -> true, anything else -> false.
  // Check specifically for 'true' or 'false' string to avoid issues.
  let isFavourite = undefined; // Default to undefined to not apply filter if not provided
  if (req.query.isFavourite !== undefined) {
    // Only convert if the parameter is actually present
    isFavourite = req.query.isFavourite === 'true';
  }
  // --- END NEW ---

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw createHttpError(400, 'Invalid sortOrder. Must be "asc" or "desc".');
  }

  // Call the listContacts service, passing pagination, sorting, AND filtering parameters.
  const paginatedContacts = await listContacts({
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

// *****************************************************************
// Решта контролерів (getContactByIdController, createContactController,
// updateContactController, deleteContactController) залишаються без змін.
// Я їх тут не повторюю, щоб не захаращувати код, але вони мають бути у вашому файлі.
// *****************************************************************

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
  const deletedContact = await deleteContact(contactId);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
