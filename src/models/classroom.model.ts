import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Lesson from "./lesson.model";

@Entity()
class Classroom {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false
  })
  number: string;

  @OneToMany(() => Lesson, lesson => lesson.classroom)
  lessons: Lesson[];
}

export default Classroom;