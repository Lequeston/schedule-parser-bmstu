import { Schema, model } from 'mongoose';

const WeekTypeSchema = new Schema({
  title: {type: String, unique: true, required: true}
});

export default model('WeekType', WeekTypeSchema);