import TimeModel from '../models/time.model.js';
import DatabaseParent from './classes/databaseParent.js';

class TimeService extends DatabaseParent{
  async removeAll() {
    await TimeModel.deleteMany({});
  }

  async addInDB(time) {
    const getNumberMinutes = (str) => {
      const [hours, minutes] = str.split(':');
      return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    }
    if (time) {
      const timeStrings = time.replace(/\s/g, '').split('-');
      const to = getNumberMinutes(timeStrings[0]);
      const from = getNumberMinutes(timeStrings[1]);
      const candidate = await TimeModel.findOne({ to, from });
      if (!candidate && time) {
        const timeM = await TimeModel.create({ to, from });
        return timeM;
      }
      return candidate;
    } else {
      return null;
    }
  }

  async getAll() {
    return TimeModel.find({}).sort('to');
  }
}

export default new TimeService();