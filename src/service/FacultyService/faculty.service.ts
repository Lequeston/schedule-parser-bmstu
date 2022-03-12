import { DeleteResult, getConnection, getRepository, InsertResult } from "typeorm";
import Faculty from "../../models/faculty.model";

export class FacultyService {

  public normalization(title: string) {
    return title.trim();
  }

  async find(title: string): Promise<Faculty | undefined> {
    const faculty = await getRepository(Faculty).findOne({ title });
    return faculty;
  }

  async clear(): Promise<DeleteResult> {
    return await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Faculty)
      .execute();
  }

  async getAll(): Promise<Faculty[]> {
    return await getConnection()
      .getRepository(Faculty)
      .createQueryBuilder('faculty')
      .getMany();
  }

  async saveArray(facultiesArray: Array<string>): Promise<InsertResult> {
    const faculties = facultiesArray.map(faculty => ({
      title: this.normalization(faculty)
    }));
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Faculty)
      .values(faculties)
      .execute();
  }
}