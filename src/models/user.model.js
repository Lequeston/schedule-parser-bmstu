import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  groupId: {type: Schema.Types.ObjectId, ref: 'Group'},
  userId: {type: String, unique: true, required: true},
  username: {type: String, unique: true, required: true}
});

export default model('User', UserSchema);