import TeacherModel from '../models/teacher.model.js';
import DatabaseParent from './classes/databaseParent.js';

class TeacherService extends DatabaseParent {
  async removeAll() {
    await TeacherModel.deleteMany({});
  }
  async addInDB(name) {
    if (name) {
      const fullName = name;
      const candidate = await TeacherModel.findOne({ fullName });
      if (!candidate && fullName) {
        const teacher = await TeacherModel.create({ fullName });
        return teacher;
      }
      return candidate;
    } else {
      return null;
    }
  }
  async getTeacher(id) {
    return await TeacherModel.findById(id);
  }
}

export default new TeacherService();