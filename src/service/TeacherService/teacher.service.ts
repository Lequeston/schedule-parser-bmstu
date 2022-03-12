import { getConnection, InsertResult } from "typeorm";
import Teacher from "../../models/teacher.model";

export class TeacherService {
  private normalization(fullName: string) {
    return fullName.trim();
  }

  public findElem(value: string, array: Array<Teacher>): Teacher | undefined {
    const teacher = array.find(teacher => {
      return this.normalization(value) === this.normalization(teacher.fullName);
    });
    return teacher;
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Teacher)
      .execute();
  }

  async getAllValues(): Promise<Teacher[]> {
    return await getConnection()
      .getRepository(Teacher)
      .createQueryBuilder('teacher')
      .getMany();
  }

  async saveArray(teacherArray: Array<string>): Promise<InsertResult> {
    const teachers = teacherArray.map(teacher => {
      const fullName = this.normalization(teacher);
      return ({
        fullName
      });
    });

    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Teacher)
      .values(teachers)
      .execute();
  }
}