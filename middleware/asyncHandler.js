/**
 * @desc    Wrap async route handlers to catch errors automatically
 * @purpose Prevents unhandled promise rejections that cause FUNCTION_INVOCATION_FAILED
 * @usage   Instead of: router.get('/path', asyncController)
 *         Use:       router.get('/path', asyncHandler(asyncController))
 */
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
