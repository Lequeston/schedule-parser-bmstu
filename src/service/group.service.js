const GroupModel = require('../models/group.model.js');
const DatabaseParent = require('./classes/databaseParent.js');

class GroupService extends DatabaseParent {
  async removeAll() {
    await GroupModel.deleteMany({});
  }
  async addInDB(title) {
    if (title) {
      const candidate = await GroupModel.findOne({ title });
      if (!candidate && title) {
        const group = await GroupModel.create({ title });
        return group;
      }
      return candidate;
    } else {
      return null;
    }
  }
  async getGroupId(group) {
    if (!group) {
      return null;
    }
    const dbGroup = await GroupModel.findOne({ title: group });
    return dbGroup && dbGroup._id;
  }
  async getGroup(id) {
    if (!id) {
      return null;
    }
    const dbGroup = await GroupModel.findById(id);
    return dbGroup;
  }
}

module.exports = new GroupService();