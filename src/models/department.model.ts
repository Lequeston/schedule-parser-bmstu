import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import Faculty from "./faculty.model";
import Group from "./group.model";

@Entity()
class Department {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    nullable: false
  })
  number: string;

  @ManyToOne(() => Faculty, faculty => faculty.departments)
  faculty: Faculty;

  @OneToMany(() => Group, group => group.department)
  groups: Group[]
}

export default Department;