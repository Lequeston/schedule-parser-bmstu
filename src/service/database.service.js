/*import teacherService from './teacher.service.js';
import classroomService from './classroom.service.js';
import groupService from './group.service.js';
import timeService from './time.service.js';
import lessonTypeService from './lessonType.service.js';
import weekdayService from './weekday.service.js';
import lessonService from './lesson.service.js';
import weekTypeService from './weekType.service.js';

class DatabaseService {
  async removeAllData() {
    await teacherService.removeAll();
    await classroomService.removeAll();
    await groupService.removeAll();
    await timeService.removeAll();
    await lessonTypeService.removeAll();
    await weekdayService.removeAll();
    await weekTypeService.removeAll();
    await lessonService.removeAll();
  }
  async saveElement(
    classroomId,
    groupId,
    lessonTypeId,
    teacherId,
    timeId,
    weekdayId,
    weekTypeId,
    value
  ) {
    return await lessonService.addInDB(
      classroomId || null,
      groupId,
      lessonTypeId || null,
      teacherId || null,
      timeId,
      weekdayId,
      weekTypeId,
      value
    );
  }
  async saveData(data) {
    const groupValues = await groupService.addArrayInDB(data.groups);
    const weekdayValues = await weekdayService.addArrayInDB(data.dayTitles);
    const timeValues = await timeService.addArrayInDB(data.times);
    const weekTypeValues = await weekTypeService.addArrayInDB(data.weekTypes);
    const teacherValues = await teacherService.addArrayInDB(data.teachers);
    const classroomValues = await classroomService.addArrayInDB(data.offices);
    const lessonTypeValues = await lessonTypeService.addArrayInDB(data.lessonTypes);
    for (const lesson of data.data) {
      await this.saveElement(
        classroomValues.get(lesson.office),
        groupValues.get(lesson.groupTitle),
        lessonTypeValues.get(lesson.info),
        teacherValues.get(lesson.teacher),
        timeValues.get(lesson.time),
        weekdayValues.get(lesson.dayTitle),
        weekTypeValues.get(lesson.weekType),
        lesson.title
      )
    }
  }
  async getData(groupId) {
    const group = await groupService.getGroup(groupId);
    const weekDays = await weekdayService.getAll();
    const timesDB = await timeService.getAll();
    const lessonsDB = await lessonService.getAll(groupId);
    const weekTypes = await weekTypeService.getAll();

    for (const lesson of lessonsDB) {
      const office = await classroomService.getOffice(lesson.classroomId);
      const teacher = await teacherService.getTeacher(lesson.teacherId);
      const type = await lessonTypeService.getType(lesson.lessonTypeId);
      lesson.office = office && office.number;
      lesson.teacher = teacher && teacher.fullName;
      lesson.type = type && type.title;
    }

    const findLesson = (groupId, dayId, timeId) => {
      return (weekTypeId) => {
        const lesson = lessonsDB.find(value => {
          return value.groupId.equals(groupId) &&
            value.weekdayId.equals(dayId) &&
            value.timeId.equals(timeId) &&
            value.weekTypeId.equals(weekTypeId);
        });
        return lesson && {
          title: lesson.title,
          id: lesson._id,
          office: lesson.office,
          teacher: lesson.teacher,
          type: lesson.type
        }
      }
    }
    const days = weekDays.map(day => {
      const formatTime = (number) => {
        return number > 9 ? number : '0' + number;
      }
      const times = timesDB.map(({ to, from, _id}) => {
        const findLes = findLesson(groupId, day._id, _id);
        return {
          time: `${formatTime(Math.floor(to / 60))}:${formatTime(to % 60)} - ${formatTime(Math.floor(from / 60))}:${formatTime(from % 60)}`,
          lessons: weekTypes.map(value => findLes(value._id))
        }
      })
      return {
        dayTitle: day.title,
        times
      };
    })

    return {
      groupTitle: group.title,
      types: weekTypes,
      days: days
    }
  }
}

export default new DatabaseService();
*/