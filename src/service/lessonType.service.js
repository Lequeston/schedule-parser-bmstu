const LessonTypeModel = require('../models/lessonType.model.js');
const DatabaseParent = require('./classes/databaseParent.js');

class LessonTypeService extends DatabaseParent {
  async removeAll() {
    await LessonTypeModel.deleteMany({});
  }
  async addInDB(title) {
    if (title) {
      const candidate = await LessonTypeModel.findOne({ title });
      if (!candidate && title) {
        const lessonType = await LessonTypeModel.create({ title });
        return lessonType;
      }
      return candidate;
    } else {
      return null;
    }
  }
  async getType(id) {
    return await LessonTypeModel.findById(id);
  }
}

module.exports = new LessonTypeService();