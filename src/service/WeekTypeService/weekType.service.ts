import { getConnection } from "typeorm";
import WeekType from "../../models/weekType.model";

export class WeekTypeService {
  public normalization(title: string) {
    return title.trim().toUpperCase();
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