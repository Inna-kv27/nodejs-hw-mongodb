import createHttpError from 'http-errors';

const validateBody = (schema) => (req, res, next) => {
  // --- ПОЧАТОК ДЕБАГ-КОДУ ---
  console.log('--- validateBody middleware ---');
  console.log('req.body received by validateBody:', req.body);
  if (req.body.isFavourite !== undefined) {
    console.log('isFavourite value:', req.body.isFavourite);
    console.log('isFavourite type:', typeof req.body.isFavourite);
  }
  // --- КІНЕЦЬ ДЕБАГ-КОДУ ---

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const validationErrors = error.details.map((err) => err.message);

    const httpError = createHttpError(400, 'Validation error', {
      data: validationErrors,
    });
    return next(httpError);
  }

  next();
};

export default validateBody;
