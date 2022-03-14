import { Telegraf } from 'telegraf';
import ejs from 'ejs';
import path from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import fs from 'fs';

import logger from '../config/logger';

import { appStatus } from './statusApp';
import lessonService from '../service/LessonService';
import weekTypeService from '../service/WeekTypeService';
import teacherService from '../service/TeacherService';
import scheduleController from '../controllers/ScheduleController';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.use((ctx, next) => {
  if (appStatus === 'SAVING_DATA') {
    ctx.reply('Сейчас сервис не доступен');
  } else {
    next();
  }
});

bot.start((ctx) => {
  ctx.reply('Добро пожаловать!');
});

/*
bot.command('group', async ctx => {
  const wordArray = ctx
    .message
    .text
    .split(' ');
  const text = wordArray && wordArray[1] && wordArray[1].toUpperCase();
  logger.info(text);
  const groupId = await groupService.getGroupId(text);
  logger.info(groupId);
  if (groupId) {
    await userService.saveGroup(ctx.from.id, groupId, ctx.from.username);
    await ctx.reply('Группа успешно установлена');
  } else {
    await ctx.reply('Группа ведена некорректно');
  }
});*/

bot.command('schedule', async ctx => {
  const wordArray = ctx
    .message
    .text
    .split(' ');
  //const groupId = await userService.getGroupId(ctx.from.id);
  const group = wordArray && wordArray[1] && wordArray[1].toUpperCase();
  const filename = path.resolve(__dirname, '..', 'views', 'schedule.ejs');
  logger.info(ctx.from.username, group);

  if (group) {
    const data = await lessonService.getScheduleGroup(group);
    const weekTypes = await weekTypeService.getAllValues();
    const template = fs.readFileSync(filename);
    const html = await ejs.render(template.toString(), { values: data, weekTypes });

    const image = await nodeHtmlToImage({
      html: html
    }) as Buffer;

    await ctx.replyWithPhoto({ source: image }, { caption: group });
  } else {
    await ctx.reply('Группа ведена некорректно');
  }
});

bot.command('teacher', scheduleController.teacher);
bot.action(/^teacher(?:::(\d+))$/, scheduleController.teacherSchedule);

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot;