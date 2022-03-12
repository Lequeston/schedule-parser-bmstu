import { getConnection } from "typeorm";
import Weekday from "../../models/weekday.model";

export class WeekDayService {
  private days: Array<string> = [
    'ПН',
    'ВТ',
    'СР',
    'ЧТ',
    'ПТ',
    'СБ'
  ];

  private normalization(title: string) {
    return title.trim().toUpperCase();
  }

  public findElem(value: string, array: Array<Weekday>): Weekday | undefined {
    const weekDay = array.find(weekDay => {
      return this.normalization(value) === this.normalization(weekDay.title);
    });
    return weekDay;
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
      .orderBy('weekDay.numberDay')
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