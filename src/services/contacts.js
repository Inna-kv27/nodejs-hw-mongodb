import Contact from '../db/models/Contact.js'; // Тепер це імпорт за замовчуванням

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
 * Ця функція використовується контролером createContactController.
 * @param {Object} payload - Об'єкт, що містить дані для створення контакту (name, phoneNumber, email, isFavourite, contactType).
 * @returns {Promise<Object>} Створений об'єкт контакту.
 */
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

/**
 * Функція для оновлення існуючого контакту в базі даних.
 * Ця функція є заглушкою для Кроку 4.
 * @param {string} contactId - ID контакту, який потрібно оновити.
 * @param {Object} payload - Об'єкт, що містить дані для оновлення.
 * @returns {Promise<Object|null>} Оновлений об'єкт контакту або null, якщо не знайдено.
 */
export const updateContact = async (contactId, payload) => {
  // Використовуємо findByIdAndUpdate, щоб знайти контакт за ID та оновити його.
  // Опція { new: true } гарантує, що метод поверне оновлений документ.
  const updatedContact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return updatedContact;
};

/**
 * Функція для видалення контакту з бази даних.
 * Ця функція є заглушкою для Кроку 5.
 * @param {string} contactId - ID контакту, який потрібно видалити.
 * @returns {Promise<Object|null>} Видалений об'єкт контакту або null, якщо не знайдено.
 */
export const deleteContact = async (contactId) => {
  // Використовуємо findByIdAndDelete, щоб знайти контакт за ID та видалити його.
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};
