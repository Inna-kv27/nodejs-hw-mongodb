import createHttpError from 'http-errors';
import Session from '../models/Session.js'; // Імпортуємо модель Session
import asyncHandler from '../utils/asyncHandler.js'; // НОВЕ: Імпортуємо asyncHandler

/**
 * Middleware для автентифікації користувача за access токеном.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 * @param {import('express').NextFunction} next - Функція для передачі управління наступному middleware.
 * @throws {createHttpError.Unauthorized} Якщо токен відсутній, недійсний або протермінований.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // НОВЕ: Обгортаємо функцію за допомогою asyncHandler
  // 1. Отримуємо заголовок Authorization.
  const authHeader = req.get('Authorization'); // Або req.headers.authorization

  // 2. Перевіряємо наявність заголовка.
  if (!authHeader) {
    throw createHttpError(401, 'Not authorized'); // 401 Unauthorized
  }

  // 3. Парсимо Bearer токен. Очікуємо формат "Bearer <token>".
  const [bearer, accessToken] = authHeader.split(' '); // Розділяємо "Bearer" і сам токен

  // 4. Перевіряємо, чи це дійсно Bearer токен та чи є сам токен.
  if (bearer !== 'Bearer' || !accessToken) {
    throw createHttpError(401, 'Not authorized'); // 401 Unauthorized
  }

  // 5. Знаходимо сесію за access токеном.
  // Використовуємо .populate('userId') для автоматичного завантаження даних користувача,
  // на якого посилається userId в сесії. Це зручно, оскільки req.user відразу міститиме повний об'єкт користувача.
  const session = await Session.findOne({ accessToken }).populate('userId');

  // 6. Перевіряємо, чи сесію знайдено.
  if (!session) {
    throw createHttpError(401, 'Session not found'); // 401 Unauthorized
  }

  // 7. Перевіряємо термін дії access токена.
  const isAccessTokenExpired = new Date() > session.accessTokenValidUntil;
  if (isAccessTokenExpired) {
    // Якщо access токен протермінований, видаляємо сесію (вона вже недійсна) і повертаємо 401.
    // Це забезпечить, що після закінчення access токена потрібно буде оновити сесію.
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Access token expired'); // 401 Unauthorized
  }

  // 8. Додаємо об'єкт користувача до req.
  // Оскільки ми використали .populate('userId'), session.userId вже є повним об'єктом User.
  req.user = session.userId;

  // 9. Додаємо об'єкт сесії до req (опціонально, але корисно для деяких логік, як логаут).
  req.session = session;

  // 10. Передаємо управління наступному middleware або контролеру.
  next();
}); // НОВЕ: Закриваємо обгортку asyncHandler

export default authenticate;
