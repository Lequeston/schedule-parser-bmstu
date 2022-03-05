export type ParseTime = {
  start: number,
  end: number,
}

export type ParserLesson = {
  title: string,
  typeLesson: string | null,
  office: string | null,
  teacher: string | null,
  time: ParseTime,
  groupTitle: string,
  dayTitle: string,
  weekType: string
}

export type ParserData = {
  data: Array<ParserLesson>,
  times: Array<ParseTime>,
  teachers: Array<String>,
  weekTypes: Array<String>,
  offices: Array<string>,
  lessonTypes: Array<string>,
  groups: Array<string>,
  dayTitles: Array<string>
}