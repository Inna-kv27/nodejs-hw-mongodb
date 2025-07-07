import createHttpError from 'http-errors';
import Session from '../models/Session.js'; // Імпортуємо модель Session (з великої літери S)
import User from '../models/User.js'; // Імпортуємо модель User (з великої літери U)
import asyncHandler from '../utils/asyncHandler.js'; // Імпортуємо asyncHandler

/**
 * Middleware для автентифікації користувача за access токеном.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 * @param {import('express').NextFunction} next - Функція для передачі управління наступному middleware.
 * @throws {createHttpError.Unauthorized} Якщо токен відсутній, недійсний або протермінований.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Обгортаємо функцію за допомогою asyncHandler
  // Цей коментар для лінтера, щоб він не підкреслював User як невикористаний.
  // Модель User потрібна для populate('userId') в Session.findOne().
  // eslint-disable-next-line no-unused-vars
  const _userModel = User; // Фіктивне використання для лінтера, не впливає на логіку.

  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw createHttpError(401, 'Not authorized');
  }

  const [bearer, accessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    throw createHttpError(401, 'Not authorized');
  }

  const session = await Session.findOne({ accessToken }).populate('userId');

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isAccessTokenExpired = new Date() > session.accessTokenValidUntil;
  if (isAccessTokenExpired) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Access token expired');
  }

  req.user = session.userId;
  req.session = session;

  next();
});

export default authenticate;
