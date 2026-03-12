const { NODE_ENV } = require('../config/env');

module.exports = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
};
