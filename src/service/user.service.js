const userModel = require('../models/user.model');

class UserService {
  async saveGroup(userId, groupId, username) {
    await userModel.deleteOne({ userId });
    return await userModel.create({
      userId,
      groupId,
      username
    })
  }

  async getGroupId(userId) {
    if (!userId) {
      return null;
    }
    const user = await userModel.findOne({ userId });
    return user.groupId;
  }
}

module.exports = new UserService();