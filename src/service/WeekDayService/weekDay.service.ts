import { getConnection } from "typeorm";
import Weekday from "../../models/weekday.model";

export class WeekDayService {
  private days: Array<string> = [
    'ПН',
    'ВТ',
    'СР',
    'ЧТ',
    'ПТ',
    'СБ',
    'ВС'
  ];

  public normalization(title: string) {
    return title.trim().toUpperCase();
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Weekday)
      .execute();
  }

  async getAllValues(): Promise<Weekday[]> {
    return await getConnection()
      .getRepository(Weekday)
      .createQueryBuilder('weekDay')
      .getMany();
  }

  async saveArray() {
    const weekDays = this.days.map((weekDay, iter) => {
      const title = this.normalization(weekDay);
      return ({
        title,
        numberDay: iter
      })
    });
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Weekday)
      .values(weekDays)
      .execute();
  }
}