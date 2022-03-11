import { DeleteResult, getConnection, getRepository, InsertResult } from "typeorm";
import Classroom from "../../models/classroom.model";

export class ClassroomService {

  private normalization(number: string) {
    return number.trim();
  }

  public findElem(value: string, array: Array<Classroom>): Classroom | undefined {
    const classroom = array.find(classroom => {
      return this.normalization(value) === this.normalization(classroom.number);
    });
    return classroom;
  }

  async find(number: string): Promise<Classroom | undefined> {
    const classroom = await getRepository(Classroom).findOne({ number });
    return classroom;
  }

  async clear(): Promise<DeleteResult> {
    return await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Classroom)
      .execute();
  }

  async getAllValues(): Promise<Classroom[]> {
    return await getConnection()
      .getRepository(Classroom)
      .createQueryBuilder('classroom')
      .getMany();
  }

  async saveArray(classroomsArray: Array<string>): Promise<InsertResult> {
    const classrooms = classroomsArray.map(classroom => ({
      number: this.normalization(classroom)
    }));
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Classroom)
      .values(classrooms)
      .execute();
  }
}