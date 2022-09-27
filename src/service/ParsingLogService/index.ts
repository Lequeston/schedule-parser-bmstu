import { ParsingLogService } from "./parsingLog.service";


const TIME_OBSOLESCENT = parseInt(process.env.TIME_OBSOLESCENT || '', 10);
if (!TIME_OBSOLESCENT) {
  throw new Error(`Вы не указали TIME_OBSOLESCENT: ${TIME_OBSOLESCENT}`);
}
export default new ParsingLogService(TIME_OBSOLESCENT);