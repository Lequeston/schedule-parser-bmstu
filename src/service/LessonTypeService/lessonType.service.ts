import { getConnection, InsertResult } from "typeorm";
import LessonType from "../../models/lessonType.model";

export class LessonTypeService {

  public findElem(value: string, array: Array<LessonType>): LessonType | undefined {
    const lessonType = array.find(lessonType => {
      return value === lessonType.title;
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
      return ({
        title: lessonType
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