import { Schema, model } from 'mongoose';

const LessonTypeSchema = new Schema({
  title: {type: String, unique: true, required: true}
});

export default model('LessonType', LessonTypeSchema);