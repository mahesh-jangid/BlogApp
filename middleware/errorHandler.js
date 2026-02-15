const errorHandler = (err, req, res, next) => {
  // Ensure we always have some error information
  if (!err) {
    return next();
  }

  console.error('📛 Error:', {
    name: err.name,
    message: err.message,
    code: err.code,
    statusCode: err.status || err.statusCode,
    stack: err.stack?.split('\n').slice(0, 3).join('\n'),
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ 
      success: false, 
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Prevent TypeError from crashing
  if (err instanceof TypeError) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error: Type error occurred',
    });
  }

  // Default error - always return valid JSON
  const statusCode = err.status || err.statusCode || 500;
  const statusOK = statusCode >= 200 && statusCode < 600;

  res.status(statusOK ? statusCode : 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
