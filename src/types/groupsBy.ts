import Group from "../models/group.model";
import Lesson from "../models/lesson.model";
import Time from "../models/time.model";
import Weekday from "../models/weekday.model";

export type GroupByGroupData = {
  group: Group;
  days: {
      weekDay: Weekday;
      times: {
          time: Time;
          lessons: Lesson[];
      }[];
  }[];
}