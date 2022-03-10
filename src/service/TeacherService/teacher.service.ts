import { getConnection, InsertResult } from "typeorm";
import Teacher from "../../models/teacher.model";

export class TeacherService {
  public normalization(fullName: string) {
    return fullName.trim();
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