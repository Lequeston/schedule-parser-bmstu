const { Schema, model } = require('mongoose');

const LessonTypeSchema = new Schema({
  title: {type: String, unique: true, required: true}
});

module.exports = model('LessonType', LessonTypeSchema);