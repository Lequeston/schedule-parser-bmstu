import 'dotenv/config';

import { CronJob } from 'cron';

import bot from './libs/bot';
import { connection, saveParseData } from './libs/db';
import parse from './libs/parser';
import classroomService from './service/ClassroomService';
import LessonService from './service/LessonService';
import logger from './config/logger';

const isParsing: boolean = Boolean(process.env.IS_PARSING) || false;

//const parseJob = new CronJob('00 00 3 * * 0', () => {
//  parse(saveParseData);
//}, null, true, 'Europe/Moscow');

const start = async () => {
  try {
    await connection.connect();
    //parse(saveParseData);
    const lessons = await LessonService.getScheduleGroup('ИУ6-43Б');
    logger.info(JSON.stringify(lessons, null, 2));
    //isParsing && parseJob.start();
    //await bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



