import { getConnection } from "typeorm";
import WeekType from "../../models/weekType.model";

export class WeekTypeService {
  private normalization(title: string) {
    return title.trim().toUpperCase();
  }

  public findElem(value: string, array: Array<WeekType>): WeekType | undefined {
    const weekType = array.find(weekType => {
      return this.normalization(value) === this.normalization(weekType.title);
    });
    return weekType;
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(WeekType)
      .execute();
  }

  async getAllValues(): Promise<WeekType[]> {
    return await getConnection()
      .getRepository(WeekType)
      .createQueryBuilder('weekType')
      .orderBy('weekType.title', 'DESC')
      .getMany();
  }

  async saveArray(weekTypesArray: Array<string>) {
    const weekTypes = weekTypesArray.map(weekType => {
      const title = this.normalization(weekType);
      return ({
        title
      })
    });
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(WeekType)
      .values(weekTypes)
      .execute();
  }
}