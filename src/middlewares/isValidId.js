import mongoose from 'mongoose'; // Імпортуємо mongoose для перевірки isValidObjectId
import createHttpError from 'http-errors'; // Імпортуємо для створення HTTP-помилок

/**
 * Middleware для перевірки валідності формату ID в параметрах маршруту (req.params).
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 * @param {import('express').NextFunction} next - Функція для передачі управління наступному middleware.
 */
const isValidId = (req, res, next) => {
  // Отримуємо contactId з параметрів маршруту.
  // Вважаємо, що ID завжди називається 'contactId' в роутах, де застосовується цей middleware.
  const { contactId } = req.params;

  // Перевіряємо, чи є contactId валідним ObjectId MongoDB.
  if (!mongoose.isValidObjectId(contactId)) {
    // Якщо ID невалідний, створюємо і передаємо помилку 400 Bad Request.
    // Цю помилку перехопить errorHandler.
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  // Якщо ID валідний, передаємо управління наступному middleware.
  next();
};

export default isValidId;
