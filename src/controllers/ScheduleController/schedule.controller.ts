import ejs from "ejs";
import nodeHtmlToImage from "node-html-to-image";
import { Context, Markup, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { MessageSubType, MountMap, UpdateType } from "telegraf/typings/telegram-types";
import lessonService from "../../service/LessonService";
import teacherService from "../../service/TeacherService";
import weekTypeService from "../../service/WeekTypeService";
import { ChatController } from "../ChatController/chat.controller";
import path from 'path';
import fs from 'fs';
import groupService from "../../service/GroupService";
import { cacheClient } from "../../libs/cashe";
import logger from "../../config/logger";

type MatchedContext<
  C extends Context,
  T extends UpdateType | MessageSubType
> = NarrowedContext<C, MountMap[T]>


const rootPath = path.resolve(__dirname, '..', '..');
const filenameTeacher = path.resolve(rootPath, 'views', 'schedule.ejs');
const filenameGroup = path.resolve(rootPath, 'views', 'schedule.ejs');
const scheduleTeacher = fs.readFileSync(filenameTeacher);
const scheduleGroup = fs.readFileSync(filenameGroup);
export class ScheduleController extends ChatController {
  constructor() {
    super();
  }

  async teacherSchedule(ctx: MatchedContext<Context<Update> & {
    match: RegExpExecArray;
  }, "callback_query">) {
    const teacherId = parseInt(ctx.match[1], 10);
    const teacher = await teacherService.getTeacherId(teacherId);
    if (teacher) {
      super.send(ctx, 'Генерируем для вас расписание');
      const data = await lessonService.getScheduleTeacher(teacher.fullName);

      const teacherID = await cacheClient.get(teacher.id.toString());
      if (teacherID) {
        logger.info(`${teacher.fullName}: взят из кэша`);
        await ctx.replyWithPhoto(teacherID, { caption: teacher.fullName });
      } else {
        const weekTypes = await weekTypeService.getAllValues();
        const html = await ejs.render(scheduleTeacher.toString(), { values: data, weekTypes });

        const image = await nodeHtmlToImage({
          html: html
        }) as Buffer;

        const message = await ctx.replyWithPhoto({ source: image }, { caption: teacher.fullName });

        if (message.photo.length > 0) {
          logger.info(`${teacher.fullName} добавлен в кэш`);
          // число не подходит приходится к строке преобразовать подумать как красиво решить
          await cacheClient.set(teacher.id.toString(), message.photo[0].file_id);
        }
      }
    } else {
      super.send(ctx, 'Произошла непредвиденная ошибка');
    }
  }

  async teacher(ctx: MatchedContext<Context<Update>, "text">) {
    try {
      const args = super.parseArgs(ctx.message.text);
      const teacherSearch = args.join(' ');
      const teachers = await teacherService.getTeachers(teacherSearch);
      if (teachers.length > 0) {
        const markup = Markup.inlineKeyboard(
          teachers.map(teacher => Markup.button.callback(teacher.fullName, `teacher::${teacher.id}`)),
          { wrap: (_, index, currentRow) => currentRow.length <= (index + 1) }
        );
        await super.send(ctx, 'Выберете преподавателя из списка:', markup);
      } else {
        super.send(ctx, 'Данные введены некорректно');
      }
    } catch(e) {
      console.error(e);
    }
  }

  async group(ctx: MatchedContext<Context<Update>, "text">) {
    try {
      const args = super.parseArgs(ctx.message.text);
      const groupSearch = args[0] && args[0].toUpperCase();
      if (!groupSearch) {
        super.send(ctx, 'Вы не указали группу');
        return;
      }
      const group = await groupService.find(groupSearch);
      if (group) {
        super.send(ctx, 'Генерируем для вас расписание');
        const data = await lessonService.getScheduleGroup(group.title);

        // Берем из кэша
        const imageID = await cacheClient.get(group.id.toString());
        if (imageID) {
          logger.info(`${group.title}: взят из кэша`);
          await ctx.replyWithPhoto(imageID, { caption: group.title });
        } else {

          const weekTypes = await weekTypeService.getAllValues();
          const html = await ejs.render(scheduleGroup.toString(), { values: data, weekTypes });

          const image = await nodeHtmlToImage({
            html: html
          }) as Buffer;

          const message: Message.PhotoMessage = await ctx.replyWithPhoto({ source: image }, { caption: group.title });

          // TODO: переделать эту вермешельку
          if (message.photo.length > 0) {
            logger.info(`${group.title} добавлен в кэш`);
            // число не подходит приходится к строке преобразовать подумать как красиво решить
            await cacheClient.set(group.id.toString(), message.photo[0].file_id);
          }
        }
      } else {
        await ctx.reply('Группа не найдена');
      }
    } catch(e) {
      console.error(e);
    }
  }
}