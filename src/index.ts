import 'dotenv/config';

import { CronJob } from 'cron';

import bot from './libs/bot';
import { connection, saveParseData } from './libs/db';
import parse from './libs/parser';
import classroomService from './service/ClassroomService';

const isParsing: boolean = Boolean(process.env.IS_PARSING) || false;

//const parseJob = new CronJob('00 00 3 * * 0', () => {
//  parse(saveParseData);
//}, null, true, 'Europe/Moscow');

const start = async () => {
  try {
    await connection.connect();
    parse(saveParseData);
    //isParsing && parseJob.start();
    //await bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



