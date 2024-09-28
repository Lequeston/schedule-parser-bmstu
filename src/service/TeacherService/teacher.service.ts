import { getConnection, InsertResult } from "typeorm";
import { logger } from "../../config/logger";
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

  async getTeacherId(id: number) {
    return await getConnection()
      .getRepository(Teacher)
      .findOne(id);
  }

  async getTeachers(teacher: string): Promise<Teacher[]> {
    logger.info(getConnection()
      .getRepository(Teacher)
      .createQueryBuilder('teacher')
      .where(`regexp_replace("teacher"."fullName", '\\W+', '', 'g') ~* regexp_replace('${this.normalization(teacher)}', '\\W+', '', 'g')`)
      .getQuery());
    return await getConnection()
      .getRepository(Teacher)
      .createQueryBuilder('teacher')
      .where(`regexp_replace("teacher"."fullName", '\\W+', '', 'g') ~* regexp_replace('${this.normalization(teacher)}', '\\W+', '', 'g')`)
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