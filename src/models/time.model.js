const { Schema, model } = require('mongoose');

const TimeSchema = new Schema({
  to: {type: Number, unique: true, required: true},
  from: {type: Number, unique: true, required: true}
});

module.exports = model('Time', TimeSchema);