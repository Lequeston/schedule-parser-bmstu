import { Schema, model } from 'mongoose';

const ClassroomSchema = new Schema({
  number: {type: String, unique: true, required: true}
});

export default model('Classroom', ClassroomSchema);