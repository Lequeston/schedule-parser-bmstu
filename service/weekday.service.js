const WeekdayModel = require('../models/weekday.model.js');
const DatabaseParent = require('./classes/databaseParent.js');

const weeksDays = [
  'ПН',
  'ВТ',
  'СР',
  'ЧТ',
  'ПТ',
  'СБ',
  'ВС'
];
class WeekdayService extends DatabaseParent {
  async removeAll() {
    await WeekdayModel.deleteMany({});
  }
  async addInDB(title) {
    const numberDay = weeksDays.findIndex(day => day === title);
    if (title && numberDay !== -1) {
      const candidate = await WeekdayModel.findOne({ numberDay });
      if (!candidate && title) {
        const weekday = await WeekdayModel.create({ numberDay, title });
        return weekday;
      }
      return candidate;
    } else {
      return null;
    }
  }
  async getAll() {
    return WeekdayModel.find({}).sort('numberDay');
  }
}

module.exports = new WeekdayService();