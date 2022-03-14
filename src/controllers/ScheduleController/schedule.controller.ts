import ejs from "ejs";
import nodeHtmlToImage from "node-html-to-image";
import { Context, Markup, NarrowedContext } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { MessageSubType, MountMap, UpdateType } from "telegraf/typings/telegram-types";
import lessonService from "../../service/LessonService";
import teacherService from "../../service/TeacherService";
import weekTypeService from "../../service/WeekTypeService";
import { ChatController } from "../ChatController/chat.controller";
import path from 'path';
import fs from 'fs';
import groupService from "../../service/GroupService";

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
      const weekTypes = await weekTypeService.getAllValues();
      const html = await ejs.render(scheduleTeacher.toString(), { values: data, weekTypes });

      const image = await nodeHtmlToImage({
        html: html
      }) as Buffer;

      await ctx.replyWithPhoto({ source: image }, { caption: teacher.fullName });
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
        const weekTypes = await weekTypeService.getAllValues();
        const html = await ejs.render(scheduleGroup.toString(), { values: data, weekTypes });

        const image = await nodeHtmlToImage({
          html: html
        }) as Buffer;

        await ctx.replyWithPhoto({ source: image }, { caption: group.title });
      } else {
        await ctx.reply('Группа не найдена');
      }
    } catch(e) {
      console.error(e);
    }
  }
}