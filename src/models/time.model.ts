import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Lesson from "./lesson.model";

@Entity()
class Time {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'time',
    unique: true,
    nullable: false
  })
  start: string;

  @Column({
    type: 'time',
    unique: true,
    nullable: false
  })
  end: string;

  @OneToMany(() => Lesson, lesson => lesson.time)
  lessons: Lesson[];
}

export default Time;