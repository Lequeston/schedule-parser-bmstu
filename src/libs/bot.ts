import { Telegraf } from 'telegraf';
import ejs from 'ejs';
import path from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import fs from 'fs';

import logger from '../config/logger';

// @ts-ignore
import groupService from './service/group.service.js';
// @ts-ignore
import userService from './service/user.service.js';
// @ts-ignore
import databaseService from '../service/database.service.js';
import { appStatus } from './statusApp';

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
});

bot.command('schedule', async ctx => {
  const groupId = await userService.getGroupId(ctx.from.id);
  const group = await groupService.getGroup(groupId);
  const filename = path.resolve(__dirname, 'views', 'schedule.ejs');

  if (groupId) {
    const data = await databaseService.getData(groupId);

    const template = fs.readFileSync(filename);
    const html = await ejs.render(template.toString(), data);

    const image = await nodeHtmlToImage({
      html: html
    }) as Buffer;

    await ctx.replyWithPhoto({ source: image }, { caption: group.title});
  } else {
    await ctx.reply('Группа ведена некорректно');
  }
});

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot;