import 'dotenv/config';

import { CronJob } from 'cron';

import { connection, dbDisconnect, saveParseData } from './libs/db';
import parse from './libs/parser';
import logger from './config/logger';
import { appStatus } from './libs/statusApp';
import bot from './libs/bot';

const isParsing: boolean = Boolean(process.env.IS_PARSING) || false;

logger.info(process.pid);

const parseJob = new CronJob('00 00 3 * * 0', () => {
  logger.info(appStatus);
  if (appStatus === 'BOT_WORK') {
    logger.info('parsing');
    parse(saveParseData);
  }
}, null, true, 'Europe/Moscow');

const start = async () => {
  try {
    await connection.connect();
    isParsing && parseJob.start();
    await bot.launch();
  } catch(e) {
    logger.error(e);
  }
}

start();



