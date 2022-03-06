import WeekTypeModel from '../models/weekType.model.js';
import DatabaseParent from './classes/databaseParent.js';

class WeekTypeService extends DatabaseParent {
  async removeAll() {
    await WeekTypeModel.deleteMany({});
  }
  async addInDB(title) {
    if (title) {
      const candidate = await WeekTypeModel.findOne({ title });
      if (!candidate && title) {
        const weekType = await WeekTypeModel.create({ title });
        return weekType;
      }
      return candidate;
    } else {
      return null;
    }
  }
  async getAll() {
    return await WeekTypeModel.find({}).sort('title');
  }
}

export default new WeekTypeService();