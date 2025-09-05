const levels = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  debug: 'DEBUG',
};

function formatMessage(level, message, meta) {
  const time = new Date().toISOString();
  const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${time}] [${levels[level] || level}] ${message}${metaString}`;
}

function logInfo(message, meta) {
  console.log(formatMessage('info', message, meta));
}

function logWarn(message, meta) {
  console.warn(formatMessage('warn', message, meta));
}

function logError(message, meta) {
  console.error(formatMessage('error', message, meta));
}

function logDebug(message, meta) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(formatMessage('debug', message, meta));
  }
}

module.exports = {
  logInfo,
  logWarn,
  logError,
  logDebug,
};

