export type ParserLesson = {
  title: string,
  typeLesson: string | null,
  office: string | null,
  teacher: string | null,
  time: string,
  groupTitle: string,
  dayTitle: string,
  weekType: string
}

export type ParserData = {
  data: Array<ParserLesson>,
  times: Array<String>,
  teachers: Array<String>,
  weekTypes: Array<String>,
  offices: Array<string>,
  lessonTypes: Array<string>,
  groups: Array<string>,
  dayTitles: Array<string>
}