import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import Classroom from "./classroom.model";
import Group from "./group.model";
import LessonType from "./lessonType.model";
import Teacher from "./teacher.model";
import Time from "./time.model";
import Weekday from "./weekday.model";
import WeekType from "./weekType.model";

@Entity()
class Lesson {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  title: string;

  @ManyToOne(() => Classroom)
  classroom: Classroom;

  @ManyToOne(() => Group, group => group.lessons)
  group: Group;

  @ManyToOne(() => Time, time => time.lessons)
  time: Time;

  @ManyToOne(() => WeekType, weekType => weekType.lessons)
  weekType: WeekType;

  @ManyToOne(() => Weekday, weekday => weekday.lessons)
  weekday: Weekday;

  @ManyToOne(() => Teacher, teacher => teacher.lessons)
  teacher: Teacher;

  @ManyToOne(() => LessonType, lessonType => lessonType.lessons)
  lessonType: LessonType;
}

export default Lesson;