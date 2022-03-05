const log4js = require("log4js");
const path = require('path');

const rootPath = path.resolve(__dirname, '..', 'logs');

log4js.configure({
  appenders: {
    debug: {
      type: 'file',
      filename: path.resolve(rootPath, 'debug.log')
    }
  },
  categories: {
    default: {
      appenders: ['debug'],
      level: 'info'
    }
  }
});

const logger = log4js.getLogger();

module.exports = logger;
