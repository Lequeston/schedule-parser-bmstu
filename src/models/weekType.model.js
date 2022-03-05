const { Schema, model } = require('mongoose');

const WeekTypeSchema = new Schema({
  title: {type: String, unique: true, required: true}
});

module.exports = model('WeekType', WeekTypeSchema);