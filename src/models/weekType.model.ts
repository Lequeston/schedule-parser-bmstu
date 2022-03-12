import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Lesson from "./lesson.model";

export enum WeekTypeTitle {
  DENOMINATOR = 'ЗН',
  NUMERATOR = 'ЧС'
}

@Entity()
class WeekType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: WeekTypeTitle,
    unique: true,
    nullable: false
  })
  title: string;

  @OneToMany(() => Lesson, lesson => lesson.weekType)
  lessons: Lesson[];
}

export default WeekType;