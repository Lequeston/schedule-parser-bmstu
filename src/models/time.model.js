import { Schema, model } from 'mongoose';

const TimeSchema = new Schema({
  to: {type: Number, unique: true, required: true},
  from: {type: Number, unique: true, required: true}
});

export default model('Time', TimeSchema);