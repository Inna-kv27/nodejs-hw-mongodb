import Joi from 'joi'; // Імпортуємо Joi для побудови схем валідації

// Схема валідації для реєстрації нового користувача (POST /auth/register).
// Усі поля (name, email, password) є обов'язковими.
// Довжина пароля має бути від 8 до 16 символів.
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(16).required().messages({
    'string.min': 'Password should have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
    'any.required': 'Password is required',
  }),
});

// Схема валідації для входу користувача (POST /auth/login) - буде використано на Кроці 4.
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Схема для запиту надіслати email для скидання пароля (POST /auth/send-reset-email) - буде використано пізніше.
export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Схема для скидання пароля (POST /auth/reset-password) - буде використано пізніше.
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(16).required(),
  token: Joi.string().required(),
});
