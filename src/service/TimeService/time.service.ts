import { DeleteResult, getConnection, getRepository, InsertResult } from "typeorm";
import Time from "../../models/time.model";

export class TimeService {
  public getTime(timeValue: string) {
    const time = timeValue.trim();
    const [startTimeStr, endTimeStr] = time.split('-');
    return ({
      startTime: startTimeStr.trim(),
      endTime: endTimeStr.trim()
    });
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Time)
      .execute();
  }

  async getAllValues(): Promise<Time[]> {
    return await getConnection()
      .getRepository(Time)
      .createQueryBuilder('time')
      .getMany();
  }

  async saveArray(timeArray: Array<string>): Promise<InsertResult> {
    const times = timeArray.map(timeValue => {
      const time = this.getTime(timeValue);
      return ({
        start: time.startTime,
        end: time.endTime
      })
    });
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Time)
      .values(times)
      .execute();
  }
}