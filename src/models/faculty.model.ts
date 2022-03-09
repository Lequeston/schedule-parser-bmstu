import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Department from "./department.model";

@Entity()
class Faculty {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    nullable: false
  })
  title: string;

  @OneToMany(() => Department, department => department.faculty)
  departments: Department[];
}

export default Faculty;