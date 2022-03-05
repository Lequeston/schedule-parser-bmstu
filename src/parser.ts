import axios from 'axios';
import * as cheerio from 'cheerio';
import async from 'async';

import { ParserData, ParserLesson } from './types/parser';

const parse = async (
  saveData: (data: ParserData) => void, 
  whiteListGroups?: Array<string>
) => {
  try {
    const siteUrl: string = process.env.SITE_URL || '';
    const data: Array<ParserLesson> = [];

    const times = new Set<string>();
    const teachers = new Set<string>();
    const weekTypes = new Set<string>();
    const offices = new Set<string>();
    const lessonTypes = new Set<string>();
    const groups = new Set<string>();
    const dayTitles = new Set<string>();

    //формирует итоговый распарсенный объект
    const mergingData = (): ParserData => {
      return ({
        data,
        times: Array.from(times),
        teachers: Array.from(teachers),
        weekTypes: Array.from(weekTypes),
        offices: Array.from(offices),
        lessonTypes: Array.from(lessonTypes),
        groups: Array.from(groups),
        dayTitles: Array.from(dayTitles)
      });
    }

    const parserSchedule = async (url: string, callback: Function) => {
      const res = await axios.get(url);

      if (res.status === 200) {
        const $ = cheerio.load(res.data);

        const parseLesson = (elem: cheerio.Cheerio<cheerio.Element>) => {
          const list = $(elem).find('i');
          return $(elem).find('span').text() ? ({
            title: $(elem).find('span').text(),
            typeLesson: list.eq(0).text(),
            office: list.eq(1).text(),
            teacher: list.eq(2).text()
          }) : null;
        }

        const parserDay = (groupTitle: string, dayTitle: string) => {
          const saveLesson = (time: string, element: cheerio.Cheerio<cheerio.Element>, weekType: string) => {
            const lesson = parseLesson(element);

            times.add(time);
            weekTypes.add(weekType);
            groups.add(groupTitle);
            dayTitles.add(dayTitle);

            if (lesson) {
              lesson.typeLesson && lessonTypes.add(lesson.typeLesson);
              lesson.office && offices.add(lesson.office);
              lesson.teacher && teachers.add(lesson.teacher);

              data.push({
                ...lesson,
                time,
                groupTitle,
                dayTitle,
                weekType
              });
            }
          }
          return (i: number, elem: cheerio.Element) => {
            if (i > 1) {
              const time = $(elem).find('td.bg-grey.text-nowrap').text();
              if ($(elem).find('td[colspan="2"]').length === 1) {
                const element = $(elem).find('td[colspan="2"]').eq(0);
                saveLesson(time, element, 'ЗН');
                saveLesson(time, element, 'ЧС');
              } else {
                const success = $(elem).find('td.text-success');
                const info = $(elem).find('td.text-info');
                saveLesson(time, success, 'ЧС');
                saveLesson(time, info, 'ЗН');
              }
            }
          }
        }

        const parseTable = (groupTitle: string) => {
          return (_: number, elem: cheerio.Element) => {
            const title = $(elem).find('td.bg-grey>strong').text().trim();
            $(elem).find('tr').each(parserDay(groupTitle, title));
          }
        }
        const groupTitle = $('div.col-md-8 div.page-header>h1') && $('div.col-md-8 div.page-header>h1').text().replace(/\s+/g, ' ').trim().split(' ')[1];

        if (groupTitle) {
          $('div.container div.row div.col-md-6.hidden-xs table.table-responsive').each(parseTable(groupTitle));
        }

        $('div.panel-body div.btn-group>a').each((i, elem) => {
          const title = $(elem).text().trim();
          if (!whiteListGroups || whiteListGroups.includes(title)) {
            const url = new URL($(elem).attr('href') || '', siteUrl);
            q.push(url.href);
          }
        });
      } else {
        console.error(res.status);
      }
      callback();
    }

    const q = async.queue(parserSchedule);

    q.drain(async() => {
      const data = mergingData();
      await saveData(data);
    });
    q.push(siteUrl);
  } catch(e) {
    console.error(e);
  }
}

export default parse;