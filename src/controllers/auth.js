import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../services/auth.js'; // Імпортуємо logoutUser
import Session from '../models/Session.js';

/**
 * Контролер для реєстрації нового користувача.
 * (Без змін з попередніх кроків)
 */
export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

/**
 * Контролер для входу користувача.
 * (Без змін з попередніх кроків)
 */
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const session = await loginUser({ email, password });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    secure: true,
    sameSite: 'Lax',
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

/**
 * Контролер для оновлення сесії.
 * (Без змін з попередніх кроків)
 */
export const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const newSession = await refreshUserSession(refreshToken);

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
    secure: true,
    sameSite: 'Lax',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

/**
 * Контролер для виходу користувача.
 * Обробляє POST-запити до /auth/logout.
 * @param {import('express').Request} req - Об'єкт запиту Express, очікує refresh token у req.cookies.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 */
export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Отримуємо refresh token з cookies

  // Якщо refresh token відсутній, то сесії для видалення немає або користувач вже не автентифікований.
  // Все одно очищаємо cookie і повертаємо 204.
  if (refreshToken) {
    // Знаходимо сесію за refresh токеном
    const session = await Session.findOne({ refreshToken }); // Потрібно імпортувати Session тут

    if (session) {
      // Якщо сесію знайдено, видаляємо її
      await logoutUser(session._id);
    }
  }

  // Очищаємо (видаляємо) refresh token cookie з браузера користувача.
  // Встановлюємо термін дії на минулу дату, щоб браузер його видалив.
  res.clearCookie('refreshToken');

  // Відправляємо успішну відповідь зі статусом 204 (No Content).
  // Це означає, що запит був успішним, але немає вмісту для повернення.
  res.status(204).send();
};
