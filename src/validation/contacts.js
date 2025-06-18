import Joi from 'joi'; // Імпортуємо Joi для побудови схем валідації

// Схема валідації для створення нового контакту (POST /contacts).
// Усі обов'язкові поля повинні бути присутні.
export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    // Номер телефону - це рядок!
    'string.min': 'Phone number should have a minimum length of {#limit}',
    'string.max': 'Phone number should have a maximum length of {#limit}',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().messages({
    // Валідація формату email
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('personal', 'work', 'family', 'other')
    .required()
    .messages({
      // Обмежені значення
      'any.only': 'Contact type must be one of [personal, work, family, other]',
      'any.required': 'Contact type is required',
    }),
});

// Схема валідації для оновлення існуючого контакту (PATCH /contacts/:contactId).
// Усі поля є необов'язковими, але якщо вони присутні, вони повинні відповідати правилам.
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.min': 'Phone number should have a minimum length of {#limit}',
    'string.max': 'Phone number should have a maximum length of {#limit}',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('personal', 'work', 'family', 'other')
    .messages({
      'any.only': 'Contact type must be one of [personal, work, family, other]',
    }),
}).min(1); // Для PATCH хоча б одне поле має бути присутнім
