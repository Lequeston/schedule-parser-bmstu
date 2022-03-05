import axios from 'axios';
import * as cheerio from 'cheerio';
import async from 'async';

const parse = async (saveData: Function, whiteListGroups: undefined | Array<string>) => {
  try {
    const siteUrl = process.env.SITE_URL;
    const results = [];

    const times = new Set();
    const teachers = new Set();
    const weekTypes = new Set();
    const offices = new Set();
    const lessonTypes = new Set();
    const groups = new Set();
    const dayTitles = new Set();

    const mergingData = () => {
      return ({
        data: results,
        times: Array.from(times),
        teachers: Array.from(teachers),
        weekTypes: Array.from(weekTypes),
        offices: Array.from(offices),
        lessonTypes: Array.from(lessonTypes),
        groups: Array.from(groups),
        dayTitles: Array.from(dayTitles)
      })
    }
    const parserSchedule = async (url: string, callback: Function) => {
      const res = await axios.get(url);

      if (res.status === 200) {
        const $ = cheerio.load(res.data);

        const parseLesson = (elem: cheerio.Element) => {
          const list = $(elem).find('i');
          return $(elem).find('span').text() ? ({
            title: $(elem).find('span').text(),
            info: list.eq(0).text(),
            office: list.eq(1).text(),
            teacher: list.eq(2).text()
          }) : null;
        }

        const parserDay = (groupTitle, dayTitle) => {
          const saveLesson = (time, element, weekType) => {
            const lesson = parseLesson(element);

            times.add(time);
            weekTypes.add(weekType);
            groups.add(groupTitle);
            dayTitles.add(dayTitle);

            if (lesson) {
              lesson.info && lessonTypes.add(lesson.info);
              lesson.office && offices.add(lesson.office);
              lesson.teacher && teachers.add(lesson.teacher);

              results.push({
                ...lesson,
                time,
                groupTitle,
                dayTitle,
                weekType
              });
            }
          }
          return (i, elem) => {
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

        const parseTable = (groupTitle) => {
          return (i, elem) => {
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
            const url = new URL($(elem).attr('href'), siteUrl);
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

module.exports = parse;