import User from '../models/User.js';
import Session from '../models/Session.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import crypto from 'node:crypto';

/**
 * Сервіс для реєстрації нового користувача.
 * (Без змін з попередніх кроків)
 */
export const registerUser = async (payload) => {
  const { email, password, name } = payload;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const userResponse = newUser.toObject();
  delete userResponse.password;
  return userResponse;
};

/**
 * Сервіс для входу користувача.
 * (Без змін з попередніх кроків)
 */
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хвилин
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ); // 30 днів

  await Session.deleteOne({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

/**
 * Сервіс для оновлення сесії на основі refresh токена.
 * (Без змін з попередніх кроків)
 */
export const refreshUserSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isRefreshTokenExpired) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  const newAccessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  const newAccessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const newRefreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  const newSession = await Session.findByIdAndUpdate(
    session._id,
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: newAccessTokenValidUntil,
      refreshTokenValidUntil: newRefreshTokenValidUntil,
    },
    { new: true },
  );

  return newSession;
};

/**
 * Сервіс для виходу користувача.
 * @param {string} sessionId - ID сесії, яку потрібно видалити.
 * @returns {Promise<void>}
 */
export const logoutUser = async (sessionId) => {
  // Видаляємо сесію за її ID.
  // Цей метод повертає документ, який було видалено, або null, якщо не знайдено.
  await Session.deleteOne({ _id: sessionId });
  // Для логаута нам не потрібно перевіряти, чи сесія існувала.
  // Просто намагаємося її видалити.
};
