import { Schema, model } from 'mongoose';

const TeacherSchema = new Schema({
  fullName: {type: String, unique: true, required: true}
});

export default model('Teacher', TeacherSchema);