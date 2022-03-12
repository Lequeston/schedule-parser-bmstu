import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Lesson from "./lesson.model";

@Entity()
class Weekday {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    unique: true
  })
  title: string;

  @Column({
    type: 'smallint',
    nullable: true,
    unique: true
  })
  numberDay: number;

  @OneToMany(() => Lesson, lesson => lesson.weekday)
  lessons: Lesson[];
}

export default Weekday;