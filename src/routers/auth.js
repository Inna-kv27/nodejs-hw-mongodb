import express from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js'; // Для валідації тіла запиту
import { registerUserSchema, loginUserSchema } from '../validation/auth.js'; // Схеми валідації Joi
import ctrlWrapper from '../utils/ctrlWrapper.js'; // Обгортка для контролерів

const router = express.Router();

// Маршрут для реєстрації нового користувача: POST /auth/register
// Застосовуємо middleware validateBody з схемою registerUserSchema
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);

// Маршрут для входу користувача: POST /auth/login (буде реалізовано на Кроці 4)
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);

// Маршрут для оновлення сесії: POST /auth/refresh (буде реалізовано на Кроці 5)
router.post('/refresh', ctrlWrapper(refreshController)); // Валідація буде від cookies

// Маршрут для виходу користувача: POST /auth/logout (буде реалізовано на Кроці 6)
router.post('/logout', ctrlWrapper(logoutController));

export default router;
