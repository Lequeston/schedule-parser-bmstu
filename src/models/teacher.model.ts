import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Lesson from "./lesson.model";

@Entity()
class Teacher {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false
  })
  fullName: string;

  @OneToMany(() => Lesson, lesson => lesson.teacher)
  lessons: Lesson[];
}

export default Teacher;