import axios from "axios";
import { assert } from "typia";
import { GroupsTypesApiResponse, SchedulesTypesApiResponse } from "./backendTypes";
import { ParserData, ParserLesson } from "../../types/parser";
import { logger } from "../../config/logger";
const URL = process.env.API_SCHEDULE_URL;

const DAY_NUMBER_TO_TITLES = {
  1: 'ПН',
  2: 'ВТ',
  3: 'СР',
  4: 'ЧТ',
  5: 'ПТ',
  6: 'СБ',
  7: 'ВС',
} as const;

const WEAK_TO_WEAK_TYPE = {
  'zn': 'ЗН',
  'ch': 'ЧС',
} as const;

const LESSON_TYPE_TO_LESSON_TYPE = {
  'seminar': 'Семинар',
  'lecture': 'Лекция',
  'lab': 'Лабораторная',
} as const;



const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const parse = async (
  saveData: (data: ParserData) => void
) => {
  const lessons: Array<ParserLesson> = [];

  const times = new Set<string>();
  const teachers = new Set<string>();
  const weekTypes = new Set<string>();
  const offices = new Set<string>();
  const lessonTypes = new Set<string>();
  const groups = new Set<string>();
  const dayTitles = new Set<string>();

  const groupsUrls: string[] = [];
  const repeatUrls: string[] = [];

  const getParingStatistic = (parserData: ParserData) => {
    const statistic = {
      numberGroups: parserData.groups.length,
      numberTeachers: parserData.teachers.length,
      numberLessons: parserData.data.length
    };

    logger.info(`
      Статистика после парсинга:
        - Кол-во групп: ${statistic.numberGroups}
        - Кол-во преподавателей: ${statistic.numberTeachers}
        - Кол-во уроков: ${statistic.numberLessons}
    `);
  }

  const getGroups = async (url: string = `${URL}/structure`) => {
    const response = await axios.get(url);
    const data = assert<GroupsTypesApiResponse>(response.data);

    data.data.children.forEach((university) => {
      // проверяем что университет МГТУ им. Н.Э. Баумана, а не филиалы
      if (university.uuid === '8c1b7bb8-e690-11db-89c3-000cf1a7cbf0') {
        university.children.forEach((faculty) => {
          faculty.children.forEach((department) => {
            // не знаю зачем но они почему-то сделали под массив кафедр по курсам
            department.children.forEach((departmentCourse) => {
              departmentCourse.children.forEach((group) => {
                groupsUrls.push(`${URL}/schedules/groups/${group.uuid}/public`);
              });
            });
          });
        });
      }
    });

    logger.info(groupsUrls);
    getLessons(groupsUrls[100]);
    logger.info(groupsUrls.length);
  }

  const getLessons = async (url: string) => {
    logger.info(url);
    try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      logger.error(`Не получилось найти: ${response.status} - ${response.statusText} - ${url}`);
      repeatUrls.push(url);
    }

    const data = assert<SchedulesTypesApiResponse>(response.data);

    console.dir(data);

    // TODO: надо будет пересобрать тип времени
    data.data.schedule.forEach((lesson) => {
      times.add(`${lesson.startTime}-${lesson.endTime}`);

      // TODO: тоже надо пересобрать тип преподавателя
      lesson.teachers.forEach((teacher) => {
        teachers.add(`${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`);
      });

      if (lesson.week != 'all') {
        weekTypes.add(WEAK_TO_WEAK_TYPE[lesson.week]);
      }

      lesson.audiences.forEach((audience) => {
        offices.add(audience.name);
      });

      if (lesson.discipline.actType) {
        lessonTypes.add(LESSON_TYPE_TO_LESSON_TYPE[lesson.discipline.actType]);
      }

      lesson.groups.forEach((group) => {
        groups.add(group.name);
      });

      dayTitles.add(DAY_NUMBER_TO_TITLES[lesson.day]);

      let i = 0;
      do {
        let j = 0;
        do {
          if (lesson.week !== 'all') {
            lessons.push({
              title: lesson.discipline.fullName,
              typeLesson: lesson.discipline.actType ? LESSON_TYPE_TO_LESSON_TYPE[lesson.discipline.actType] : null,
              office: lesson.audiences[0] ? lesson.audiences[0].name : null,
              teacher: lesson.teachers[0] ? `${lesson.teachers[0].lastName} ${lesson.teachers[0].firstName} ${lesson.teachers[0].middleName}` : null,
              time: `${lesson.startTime}-${lesson.endTime}`,
              groupTitle: data.data.title,
              dayTitle: DAY_NUMBER_TO_TITLES[lesson.day],
              weekType: WEAK_TO_WEAK_TYPE[lesson.week]
            });
          } else {
            lessons.push({
              title: lesson.discipline.fullName,
              typeLesson: lesson.discipline.actType ? LESSON_TYPE_TO_LESSON_TYPE[lesson.discipline.actType] : null,
              office: lesson.audiences[0] ? lesson.audiences[0].name : null,
              teacher: lesson.teachers[0] ? `${lesson.teachers[0].lastName} ${lesson.teachers[0].firstName} ${lesson.teachers[0].middleName}` : null,
              time: `${lesson.startTime}-${lesson.endTime}`,
              groupTitle: data.data.title,
              dayTitle: DAY_NUMBER_TO_TITLES[lesson.day],
              weekType: WEAK_TO_WEAK_TYPE['zn']
            });
            lessons.push({
              title: lesson.discipline.fullName,
              typeLesson: lesson.discipline.actType ? LESSON_TYPE_TO_LESSON_TYPE[lesson.discipline.actType] : null,
              office: lesson.audiences[0] ? lesson.audiences[0].name : null,
              teacher: lesson.teachers[0] ? `${lesson.teachers[0].lastName} ${lesson.teachers[0].firstName} ${lesson.teachers[0].middleName}` : null,
              time: `${lesson.startTime}-${lesson.endTime}`,
              groupTitle: data.data.title,
              dayTitle: DAY_NUMBER_TO_TITLES[lesson.day],
              weekType: WEAK_TO_WEAK_TYPE['ch']
            });
          }
          j++;
        } while (j < lesson.teachers.length);
        i++;
      } while (i < lesson.audiences.length);
    });
  } catch (e) {
    repeatUrls.push(url);
  }
  }

  await getGroups();

  const promises = groupsUrls.map((url) => {
    return async () => {
      await getLessons(url)
    }
  });

  for (const promise of promises) {
    await delay(100);
    await promise();
  }

  console.dir(repeatUrls);

  getParingStatistic({
    data: lessons,
    times: Array.from(times),
    teachers: Array.from(teachers),
    weekTypes: Array.from(weekTypes),
    offices: Array.from(offices),
    lessonTypes: Array.from(lessonTypes),
    groups: Array.from(groups),
    dayTitles: Array.from(dayTitles),
  })

  saveData({
    data: lessons,
    times: Array.from(times),
    teachers: Array.from(teachers),
    weekTypes: Array.from(weekTypes),
    offices: Array.from(offices),
    lessonTypes: Array.from(lessonTypes),
    groups: Array.from(groups),
    dayTitles: Array.from(dayTitles),
  });
}