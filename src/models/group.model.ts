import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import Department from "./department.model";
import Lesson from "./lesson.model";
import User from "./user.model";

@Entity()
class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 20
  })
  title: string;

  @ManyToOne(() => Department, department => department.groups)
  department: Department;

  @OneToMany(() => User, user => user.group)
  users: User[];

  @OneToMany(() => Lesson, lesson => lesson.group)
  lessons: Lesson[];
}

export default Group;