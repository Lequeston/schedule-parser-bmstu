import 'dotenv/config';

import { CronJob } from 'cron';

import { connection, saveParseData } from './libs/db';
import { cacheClient } from './libs/cashe';
import { logger } from './config/logger';
import { appStatus } from './libs/statusApp';
import bot from './libs/bot';

import parsingLogService from './service/ParsingLogService';
import { parse } from './libs/apiSchedule/apiSchedule';

logger.info(process.pid);

const startParsing = async () => {
  logger.info(appStatus);
  const isParsing = await parsingLogService.dataIsNotOutdated();
  logger.info('isParsing', isParsing);
  if (appStatus === 'BOT_WORK' && isParsing) {
    logger.info('parsing');
    parse(saveParseData);
  }
}
const parseJob = new CronJob('00 00 3 * * 0', () => {
  startParsing();
}, null, true, 'Europe/Moscow');

const start = async () => {
  try {
    await connection.connect();
    await cacheClient.connect();
    await startParsing();
    parseJob.start();
    await bot.launch();
  } catch(e) {
    logger.error(e);
  }
}

start();



