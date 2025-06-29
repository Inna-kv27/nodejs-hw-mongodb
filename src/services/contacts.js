import Contact from '../models/contact.js';

/**
 * Функція для отримання всіх контактів з бази даних з пагінацією, сортуванням та фільтрацією,
 * належних конкретному користувачеві.
 * @param {string} userId - ID користувача.
 * @param {Object} queryOptions - Об'єкт з параметрами пагінації, сортування та фільтрації.
 * @param {number} [queryOptions.page=1] - Номер поточної сторінки.
 * @param {number} [queryOptions.perPage=10] - Кількість елементів на сторінці.
 * @param {string} [queryOptions.sortBy='name'] - Властивість для сортування.
 * @param {('asc'|'desc')} [queryOptions.sortOrder='asc'] - Порядок сортування.
 * @param {string} [queryOptions.type] - Фільтр за типом контакту.
 * @param {boolean} [queryOptions.isFavourite] - Фільтр за властивістю isFavourite.
 * @returns {Promise<Object>} Об'єкт з даними контактів, пагінацією та метаданими.
 */
export const listContacts = async (
  userId,
  {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  },
) => {
  const skip = (page - 1) * perPage;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortCriteria = { [sortBy]: sortDirection };

  // Фільтруємо контакти за userId поточного користувача
  const filter = { userId: userId };
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite;
  }

  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort(sortCriteria);
  // Підрахунок загальної кількості також за фільтром
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

/**
 * Функція для отримання контакту за ID, належного конкретному користувачеві.
 * @param {string} contactId - ID контакту.
 * @param {string} userId - ID користувача.
 * @returns {Promise<Object|null>} Об'єкт контакту або null, якщо не знайдено.
 */
export const getContactById = async (contactId, userId) => {
  // Шукаємо контакт за його ID та userId, щоб переконатися, що він належить користувачеві
  const contact = await Contact.findOne({ _id: contactId, userId: userId });
  return contact;
};

/**
 * Функція для створення нового контакту.
 * @param {Object} payload - Дані контакту, включаючи userId.
 * @returns {Promise<Object>} Створений контакт.
 */
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

/**
 * Функція для оновлення існуючого контакту, належного конкретному користувачеві.
 * @param {string} contactId - ID контакту.
 * @param {string} userId - ID користувача.
 * @param {Object} payload - Дані для оновлення.
 * @returns {Promise<Object|null>} Оновлений контакт або null, якщо не знайдено.
 */
export const updateContact = async (contactId, userId, payload) => {
  // Знаходимо та оновлюємо контакт за ID та userId
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId: userId },
    payload,
    { new: true }, // Повертає оновлений документ
  );
  return contact;
};

/**
 * Функція для видалення контакту, належного конкретному користувачеві.
 * @param {string} contactId - ID контакту.
 * @param {string} userId - ID користувача.
 * @returns {Promise<Object|null>} Видалений контакт або null, якщо не знайдено.
 */
export const deleteContact = async (contactId, userId) => {
  // Знаходимо та видаляємо контакт за ID та userId
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return deletedContact;
};
