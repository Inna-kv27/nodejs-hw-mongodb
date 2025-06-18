import createHttpError from 'http-errors'; // Імпортуємо для створення HTTP-помилок

/**
 * Функція-фабрика middleware для валідації тіла запиту (req.body) за Joi-схемою.
 * @param {Joi.ObjectSchema} schema - Joi-схема для валідації req.body.
 * @returns {Function} Express middleware функція.
 */
const validateBody = (schema) => (req, res, next) => {
  // Виконуємо валідацію req.body за наданою схемою.
  // `abortEarly: false` дозволяє зібрати всі помилки валідації, а не зупинятися на першій.
  const { error } = schema.validate(req.body, { abortEarly: false });

  // Якщо є помилки валідації
  if (error) {
    // Збираємо детальні повідомлення про помилки.
    // map() перетворює масив об'єктів помилок на масив рядків.
    const validationErrors = error.details.map((err) => err.message);

    // Створюємо HTTP-помилку 400 Bad Request.
    // Передаємо масив повідомлень про помилки у властивості `data` для більш детальної відповіді клієнту.
    const httpError = createHttpError(
      400, // Статус HTTP 400 (Bad Request)
      'Validation error', // Загальне повідомлення про помилку
      { data: validationErrors }, // Детальні повідомлення про помилки валідації
    );
    // Передаємо HTTP-помилку наступному middleware (errorHandler).
    return next(httpError);
  }

  // Якщо валідація пройшла успішно, передаємо управління наступному middleware.
  next();
};

export default validateBody;
