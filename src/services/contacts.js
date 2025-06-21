import Contact from '../models/contact.js'; // Ensure the path to the model is correct

/**
 * Function to retrieve all contacts from the database with pagination, sorting, and filtering.
 * @param {Object} options - Object containing pagination, sorting, and filtering parameters.
 * @param {number} [options.page=1] - The current page number (defaults to 1).
 * @param {number} [options.perPage=10] - The number of items per page (defaults to 10).
 * @param {string} [options.sortBy='name'] - The property to sort by (defaults to 'name').
 * @param {('asc'|'desc')} [options.sortOrder='asc'] - The sort order ('asc' or 'desc', defaults to 'asc').
 * @param {string} [options.type] - Filter by contactType.
 * @param {boolean} [options.isFavourite] - Filter by isFavourite.
 * @returns {Promise<Object>} An object containing contact data, pagination, and metadata.
 */
export const listContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type, // New parameter for filtering by contactType
  isFavourite, // New parameter for filtering by isFavourite
}) => {
  const skip = (page - 1) * perPage;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortCriteria = { [sortBy]: sortDirection };

  // --- NEW: Build a filter object based on query parameters ---
  const filter = {};
  if (type) {
    filter.contactType = type; // Add contactType to filter if provided
  }
  if (isFavourite !== undefined) {
    // isFavourite can be true or false, so check for undefined (not null, 0, false)
    filter.isFavourite = isFavourite; // Add isFavourite to filter if provided
  }
  // --- END NEW ---

  // Apply the filter to the find query
  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort(sortCriteria);

  // Count total items that match the filter (important for correct totalPages)
  const totalItems = await Contact.countDocuments(filter);

  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

// *****************************************************************
// Решта функцій сервісу (getContactById, createContact, updateContact, deleteContact)
// залишаються без змін з попереднього кроку.
// Я їх тут не повторюю, щоб не захаращувати код, але вони мають бути у вашому файлі.
// *****************************************************************

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const contact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return contact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};
