import createHttpError from 'http-errors';

/**
 * Middleware для обробки запитів, коли клієнт звертається до неіснуючого маршруту.
 * Створює помилку 404 (Not Found) за допомогою http-errors.
 * @param {import('express').Request} req - Об'єкт запиту Express.
 * @param {import('express').Response} res - Об'єкт відповіді Express.
 * @param {import('express').NextFunction} next - Функція для передачі управління наступному middleware.
 */
const notFoundHandler = (req, res, next) => {
  // Створюємо помилку 404 з повідомленням "Route not found"
  // і передаємо її далі до наступного middleware (зазвичай це errorHandler).
  next(createHttpError(404, 'Route not found'));
};

// Експортуємо notFoundHandler як дефолтний експорт ES Module.
// Це дозволить коректно імпортувати його за допомогою `import notFoundHandler from '...'`.
export default notFoundHandler;
