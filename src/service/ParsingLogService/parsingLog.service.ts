import { getConnection, InsertResult } from "typeorm";
import ParsingLog from "../../models/parsingLog.model";

export class ParsingLogService {
  private timeObsolescence: number;

  constructor(timeObsolescence: number) {
    this.timeObsolescence = timeObsolescence;
  }

  public async saveDateStamp(): Promise<InsertResult> {
    const dateStamp = new Date();

    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ParsingLog)
      .values({
        parsingTime: dateStamp
      })
      .execute();
  }

  public async dataIsNotOutdated(): Promise<boolean> {
    const lastDateParsing = await getConnection()
      .getRepository(ParsingLog)
      .createQueryBuilder('parsingLog')
      .orderBy('parsingLog.parsingTime', 'DESC')
      .getOne();

    const dateStamp = new Date();

    if (!lastDateParsing) {
      return true;
    }
    return (dateStamp.getTime() - lastDateParsing.parsingTime.getTime()) >= this.timeObsolescence;
  }
}