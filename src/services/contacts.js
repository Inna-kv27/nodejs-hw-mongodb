import Contact from '../models/contact.js'; // Переконайтесь, що шлях до моделі правильний ('contact.js' з малої літери 'c')

/**
 * Функція для отримання всіх контактів з бази даних.
 * @returns {Promise<Array>} Масив об'єктів контактів.
 */
export const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

/**
 * Функція для отримання контакту за його ID з бази даних.
 * @param {string} contactId - ID контакту, який потрібно знайти.
 * @returns {Promise<Object|null>} Об'єкт контакту або null, якщо не знайдено.
 */
export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

/**
 * Функція для створення нового контакту в базі даних.
 * @param {Object} payload - Об'єкт, що містить дані для створення контакту.
 * @returns {Promise<Object>} Створений об'єкт контакту.
 */
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

/**
 * Функція для оновлення існуючого контакту в базі даних.
 * @param {string} contactId - ID контакту, який потрібно оновити.
 * @param {Object} payload - Об'єкт, що містить часткові дані для оновлення контакту.
 * @returns {Promise<Object|null>} Оновлений об'єкт контакту або null, якщо не знайдено.
 */
export const updateContact = async (contactId, payload) => {
  const contact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return contact;
};

/**
 * Функція для видалення контакту з бази даних.
 * @param {string} contactId - ID контакту, який потрібно видалити.
 * @returns {Promise<Object|null>} Видалений об'єкт контакту або null, якщо не знайдено.
 */
export const deleteContact = async (contactId) => {
  // Використовуємо findByIdAndDelete для пошуку за ID та видалення.
  // Цей метод повертає видалений документ або null, якщо документ не знайдено.
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
};
