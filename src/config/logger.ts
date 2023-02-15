import log4js from 'log4js';
import path from 'path';

const rootPath = path.resolve(__dirname, '..', '..', 'logs');

log4js.configure({
  appenders: {
    debug: {
      type: 'file',
      filename: path.resolve(rootPath, 'debug.log')
    },
    chat: {
      type: 'file',
      filename: path.resolve(rootPath, 'chat.log')
    }
  },
  categories: {
    default: {
      appenders: ['debug'],
      level: 'info'
    },
    chat: {
      appenders: ['chat'],
      level: 'info'
    }
  }
});

export const logger = log4js.getLogger();
export const chatLogger = log4js.getLogger('chat');
