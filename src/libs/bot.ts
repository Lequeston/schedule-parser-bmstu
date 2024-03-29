import { Telegraf } from 'telegraf';

import { appStatus } from './statusApp';
import scheduleController from '../controllers/ScheduleController';
import { chatLogger } from '../config/logger';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.use((ctx, next) => {
  chatLogger.info(ctx.message);
  if (appStatus === 'SAVING_DATA') {
    ctx.reply('Сейчас сервис не доступен');
  } else {
    next();
  }
});

bot.start((ctx) => {
  ctx.reply(`
Добро пожаловать, ${ctx.from.first_name}!
Данный бот парсит расписание с сайта ${process.env.SITE_URL}.
Через данный бот вы можете получать расписание преподавателей и расписание групп.
Получить весь список команд можно по команде /help.

Команды:
/group <Наименование группы> - получить расписание групп. Пример: /group ИУ6-63Б
/teacher <Фамилия преподавателя> - получить расписание преподавателя. Пример: /teacher Захаров

Сообщить о баге можно тут:
https://github.com/Lequeston/schedule-parser-bmstu/issues

Предложить идею или просто высказаться тут:
https://github.com/Lequeston/schedule-parser-bmstu/discussions
  `);
});

bot.help((ctx) => {
  ctx.reply(`
Команды:
/group <Наименование группы> - получить расписание групп. Пример: /group ИУ6-63Б
/teacher <Фамилия преподавателя> - получить расписание преподавателя. Пример: /teacher Захаров

Сообщить о баге можно тут:
https://github.com/Lequeston/schedule-parser-bmstu/issues

Предложить идею или просто высказаться тут:
https://github.com/Lequeston/schedule-parser-bmstu/discussions
  `)
})

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

bot.command('group', scheduleController.group);

bot.command('teacher', scheduleController.teacher);
bot.action(/^teacher(?:::(\d+))$/, scheduleController.teacherSchedule);

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot;