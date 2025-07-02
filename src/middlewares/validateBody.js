import createHttpError from 'http-errors';

const validateBody = (schema) => (req, res, next) => {
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
