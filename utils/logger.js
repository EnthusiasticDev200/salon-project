const { createLogger, format, transports } = require('winston');
const path = require('path');

//create log file
const logFilePath = path.join(__dirname, '../logs/app.log');

// Create logger
const logger = createLogger({
  level: 'info', 
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Write all logs to file
    new transports.File({ filename: logFilePath, level: 'info' }),

    // log to console
    new transports.Console()
  ],
});

module.exports = logger;
