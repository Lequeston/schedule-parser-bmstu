import { getConnection, InsertResult } from "typeorm";
import LessonType from "../../models/lessonType.model";

export class LessonTypeService {
  public normalization(title: string) {
    return title
      .trim()
      .replace(/[^А-Яа-яЁё]/g, '')
      .toLowerCase();
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(LessonType)
      .execute();
  }

  async getAllValues(): Promise<LessonType[]> {
    return await getConnection()
      .getRepository(LessonType)
      .createQueryBuilder('lessonType')
      .getMany();
  }

  async saveArray(lessonTypeArray: Array<string>): Promise<InsertResult> {
    const lessonTypes = lessonTypeArray.map(lessonType => {
      const title = this.normalization(lessonType);
      return ({
        title
      });
    })

    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(LessonType)
      .values(lessonTypes)
      .execute();
  }
}