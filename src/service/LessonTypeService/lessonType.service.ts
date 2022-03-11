import { getConnection, InsertResult } from "typeorm";
import LessonType from "../../models/lessonType.model";

export class LessonTypeService {
  private normalization(title: string) {
    return title
      .trim()
      .replace(/[^А-Яа-яЁё]/g, '')
      .toLowerCase();
  }

  public findElem(value: string, array: Array<LessonType>): LessonType | undefined {
    const lessonType = array.find(lessonType => {
      return this.normalization(value) === this.normalization(lessonType.title);
    });
    return lessonType;
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