import Group from "../models/group.model";
import Lesson from "../models/lesson.model";
import Time from "../models/time.model";
import Weekday from "../models/weekday.model";

export type GroupByGroupData = {
  group: string;
  days: {
      weekDay: Weekday;
      times: {
          time: string;
          lessons: Lesson[];
      }[];
  }[];
}