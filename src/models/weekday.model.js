import { Schema, model } from 'mongoose';

const WeekdaySchema = new Schema({
  numberDay: {type: Number, unique: true, required: true},
  title: {type: String, unique: true, required: true}
});

export default model('Weekday', WeekdaySchema);