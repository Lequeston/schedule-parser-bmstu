const { Telegraf } = require('telegraf');
const ejs = require('ejs');
const path = require('path');
const nodeHtmlToImage = require('node-html-to-image')

const logger = require('./config/logger');
const { dbConnect, dbDisconnect } = require('./db');

const groupService = require('./service/group.service');
const userService = require('./service/user.service');
const databaseService = require('./service/database.service');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  await dbConnect();
  await next();
  await dbDisconnect();
});

bot.start((ctx) => {
  ctx.reply('Добро пожаловать!');
});

bot.command('group', async ctx => {
  const text = ctx
    .message
    .text
    .split(' ')[1]
    .toUpperCase();
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

    const html = await ejs.renderFile(filename, data);

    const image = await nodeHtmlToImage({
      html: html
    });

    await ctx.replyWithPhoto({ source: image }, { caption: group.title});
  } else {
    await ctx.reply('Группа ведена некорректно');
  }
});


module.exports = bot;