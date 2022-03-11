import { getConnection, InsertResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import Lesson from "../../models/lesson.model";
import { ParserLesson } from "../../types/parser";
import classroomService from "../ClassroomService";
import groupService from "../GroupService";
import lessonTypeService from "../LessonTypeService";
import teacherService from "../TeacherService";
import timeService from "../TimeService";
import weekDayService from "../WeekDayService";
import weekTypeService from "../WeekTypeService";

export class LessonService {

  private normalization(title: string) {
    return title.trim();
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Lesson)
      .execute();
  }

  async saveArray(lessonArray: Array<ParserLesson>): Promise<void> {
    const classrooms = await classroomService.getAllValues();
    const groups = await groupService.getAllValues();
    const times = await timeService.getAllValues();
    const weekTypes = await weekTypeService.getAllValues();
    const weekDays = await weekDayService.getAllValues();
    const teachers = await teacherService.getAllValues();
    const lessonTypes = await lessonTypeService.getAllValues();
    const lessons: QueryDeepPartialEntity<Lesson>[] = lessonArray.map(lesson => {
      const title = this.normalization(lesson.title);
      return ({
        title,
        classroom: classroomService.findElem(lesson.office || '', classrooms),
        group: groupService.findElem(lesson.groupTitle, groups),
        time: timeService.findElem(lesson.time, times),
        weekType: weekTypeService.findElem(lesson.weekType, weekTypes),
        weekday: weekDayService.findElem(lesson.dayTitle, weekDays),
        teacher: teacherService.findElem(lesson.teacher || '', teachers),
        lessonType: lessonTypeService.findElem(lesson.typeLesson || '', lessonTypes)
      });
    });

    await Promise.all(
      lessons.map(async (lesson) => {
        return await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Lesson)
          .values(lesson)
          .execute();
      })
    )
  }
}