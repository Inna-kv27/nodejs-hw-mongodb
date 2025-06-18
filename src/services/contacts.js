import Contact from '../models/contact.js'; // Переконайтесь, що шлях до моделі правильний

/**
 * Функція для отримання всіх контактів з бази даних з пагінацією.
 * @param {Object} options - Об'єкт з параметрами пагінації.
 * @param {number} options.page - Номер поточної сторінки (за замовчуванням 1).
 * @param {number} options.perPage - Кількість елементів на сторінці (за замовчуванням 10).
 * @returns {Promise<Object>} Об'єкт з даними контактів, пагінацією та метаданими.
 */
export const listContacts = async ({ page = 1, perPage = 10 }) => {
  // Обчислюємо, скільки документів потрібно пропустити (skip)
  const skip = (page - 1) * perPage;

  // Отримуємо контакти для поточної сторінки
  const contacts = await Contact.find().skip(skip).limit(perPage);

  // Отримуємо загальну кількість документів в колекції
  const totalItems = await Contact.countDocuments();

  // Обчислюємо загальну кількість сторінок
  const totalPages = Math.ceil(totalItems / perPage);

  // Визначаємо, чи є попередні/наступні сторінки
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts, // Масив контактів для поточної сторінки
    page, // Номер поточної сторінки
    perPage, // Кількість елементів на сторінці
    totalItems, // Загальна кількість елементів
    totalPages, // Загальна кількість сторінок
    hasPreviousPage, // Чи є попередня сторінка
    hasNextPage, // Чи є наступна сторінка
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
