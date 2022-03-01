const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  groupId: {type: Schema.Types.ObjectId, ref: 'Group'},
  userId: {type: String, unique: true, required: true},
  username: {type: String, unique: true, required: true}
});

module.exports = model('User', UserSchema);