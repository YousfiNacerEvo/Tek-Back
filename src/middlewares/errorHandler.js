const { logError } = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) {
    logError(message, { stack: err.stack });
  }
  res.status(status).json({ error: { message, status } });
}

module.exports = errorHandler;



