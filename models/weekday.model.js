const { Schema, model } = require('mongoose');

const WeekdaySchema = new Schema({
  numberDay: {type: Number, unique: true, required: true},
  title: {type: String, unique: true, required: true}
});

module.exports = model('Weekday', WeekdaySchema);