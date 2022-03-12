import { createQueryBuilder, getConnection, getRepository, InsertResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import Lesson from "../../models/lesson.model";
import { ParserData, ParserLesson } from "../../types/parser";
import classroomService from "../ClassroomService";
import groupService from "../GroupService";
import lessonTypeService from "../LessonTypeService";
import teacherService from "../TeacherService";
import timeService from "../TimeService";
import weekDayService from "../WeekDayService";
import weekTypeService from "../WeekTypeService";
import _, { times } from 'lodash';
import Weekday from "../../models/weekday.model";
import Time from "../../models/time.model";
import Group from "../../models/group.model";
import { GroupByGroupData } from "../../types/groupsBy";

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
    await groupService.clear();
    await classroomService.clear();
    await timeService.clear();
    await weekTypeService.clear();
    await teacherService.clear();
    await lessonTypeService.clear();
    await weekDayService.clear();
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

  async save(data: ParserData) {
    await this.clear();
    await groupService.saveArray(data.groups);
    await classroomService.saveArray(data.offices);
    await timeService.saveArray(data.times);
    await weekTypeService.saveArray(data.weekTypes);
    await teacherService.saveArray(data.teachers);
    await lessonTypeService.saveArray(data.lessonTypes);
    await weekDayService.saveArray();
    await this.saveArray(data.data);
  }

  async getLessonsGroup(groupTitle: string): Promise<Lesson[]> {
    return await getConnection()
      .createQueryBuilder()
      .select('lesson')
      .from(Lesson, 'lesson')
      .leftJoinAndSelect('lesson.classroom', 'classroom')
      .leftJoinAndSelect('lesson.group', 'group')
      .leftJoinAndSelect('lesson.time', 'time')
      .leftJoinAndSelect('lesson.weekType', 'weekType')
      .leftJoinAndSelect('lesson.weekday', 'weekday')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('lesson.lessonType', 'lessonType')
      .where('group.title = :title', {title: groupTitle})
      .getMany();
  }

  private parseToObjectScheduleGroup(lessons: Lesson[], weekdays: Weekday[], times: Time[]): GroupByGroupData[] {
    const groups: Group[] = Array.from(
      lessons.reduce((acc, lesson) => {
        return acc.add(lesson.group);
      }, new Set<Group>())
    );
    const groupByTimes = (lessons: Lesson[]) => {
      return times
        .map(time => ({
          time,
          lessons: lessons
            .filter(lesson => lesson.time.id === time.id)
            .sort((a, b) => b.weekType.title.localeCompare(a.weekType.title))
        }))
    }
    const groupByDays = (lessons: Lesson[]) => {
      return weekdays
        .map(weekDay => ({
          weekDay,
          times: groupByTimes(
            lessons.filter(lesson => lesson.weekday.id === weekDay.id)
          )
        }))
    }
    const groupByGroup = groups.map(group => ({
      group,
      days: groupByDays(
        lessons.filter(lesson => lesson.group.id === group.id)
      )
    }));
    return groupByGroup;
  }

  async getScheduleGroup(groupTitle: string): Promise<GroupByGroupData[]> {
    const lessons = await this.getLessonsGroup(groupTitle);
    const weekDays = await weekDayService.getAllValues();
    const times = await timeService.getAllValues();
    return this.parseToObjectScheduleGroup(lessons, weekDays, times);
  }
}