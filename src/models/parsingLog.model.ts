import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
class ParsingLog {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    unique: true,
    nullable: false
  })
  parsingTime: Date;
}

export default ParsingLog;