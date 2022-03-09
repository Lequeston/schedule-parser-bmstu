import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Lesson from "./lesson.model";

@Entity()
class LessonType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 5,
    unique: true,
    nullable: false
  })
  title: string;

  @OneToMany(() => Lesson, lesson => lesson.lessonType)
  lessons: Lesson[];
}

export default LessonType;