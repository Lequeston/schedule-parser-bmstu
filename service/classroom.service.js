const ClassroomModel = require('../models/classroom.model.js');
const DatabaseParent = require('./classes/databaseParent.js');

class ClassroomService extends DatabaseParent {
  async removeAll() {
    await ClassroomModel.deleteMany({});
  }
  async addInDB(number) {
    if (number) {
      const candidate = await ClassroomModel.findOne({ number });
      if (!candidate && number) {
        const classroom = await ClassroomModel.create({ number });
        return classroom;
      }
      return candidate;
    } else {
      return null;
    }
  }
  async getOffice(id) {
    return await ClassroomModel.findById(id);
  }
}

module.exports = new ClassroomService();