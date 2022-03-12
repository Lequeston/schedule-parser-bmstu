import 'dotenv/config';

import { CronJob } from 'cron';

import { connection, saveParseData } from './libs/db';
import parse from './libs/parser';
import LessonService from './service/LessonService';
import logger from './config/logger';
import { appStatus } from './libs/statusApp';
import bot from './libs/bot';

const isParsing: boolean = Boolean(process.env.IS_PARSING) || false;

const parseJob = new CronJob('00 00 3 * * 0', () => {
  if (appStatus === 'BOT_WORK') {
    parse(saveParseData);
  }
}, null, true, 'Europe/Moscow');

const start = async () => {
  try {
    await connection.connect();
    isParsing && parseJob.start();
    await bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



