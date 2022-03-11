import { DeleteResult, getConnection, getRepository, InsertResult } from "typeorm";
import Time from "../../models/time.model";

export class TimeService {
  private normalization(timeValue: string) {
    const time = timeValue.trim();
    const [startTimeStr, endTimeStr] = time.split('-');
    const startTimeArr = startTimeStr.trim().split(':');
    const endTimeArr = endTimeStr.trim().split(':');
    return ({
      startTime: `${startTimeArr[0]}:${startTimeArr[1]}:00`,
      endTime: `${endTimeArr[0]}:${endTimeArr[1]}:00`
    });
  }

  public findElem(value: string, array: Array<Time>): Time | undefined {
    const time = array.find(time => {
      const timeValue = this.normalization(value);
      return time.start === timeValue.startTime &&
        time.end === timeValue.endTime;
    });
    return time;
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
      const time = this.normalization(timeValue);
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