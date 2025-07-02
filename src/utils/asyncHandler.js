/**
 * Utility function to wrap asynchronous Express middleware.
 * Catches any errors thrown by the async function and passes them to the next middleware (error handler).
 * @param {Function} fn - The asynchronous middleware function (req, res, next).
 * @returns {Function} A wrapped middleware function.
 */
const asyncHandler = (fn) => (req, res, next) => {
  // Promise.resolve(fn(req, res, next)) ensures that the result of fn is treated as a Promise.
  // .catch(next) catches any errors from that Promise and passes them to Express's next() function,
  // which will then be handled by the error handling middleware.
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
