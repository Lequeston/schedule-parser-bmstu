import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Group from "./group.model";

@Entity()
class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false
  })
  login: string;

  @ManyToOne(() => Group, group => group.users)
  group: Group;
}

export default User;