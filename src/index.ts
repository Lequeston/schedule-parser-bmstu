import 'dotenv/config';

import { CronJob } from 'cron';

import bot from './bot';
import { saveParseData } from './db';
import parse from './parser';

const isParsing: boolean = Boolean(process.env.IS_PARSING) || false;

const parseJob = new CronJob('00 00 3 * * 0', () => {
  parse(saveParseData);
}, null, true, 'Europe/Moscow');

const start = async () => {
  try {
    isParsing && parseJob.start();
    await bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



