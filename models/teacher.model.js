const { Schema, model } = require('mongoose');

const TeacherSchema = new Schema({
  fullName: {type: String, unique: true, required: true}
});

module.exports = model('Teacher', TeacherSchema);